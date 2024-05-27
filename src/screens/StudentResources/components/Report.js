import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Modal, Form } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from '../../../utils/axios';
import { filterHtmlTag } from '../../../utils';

const options = ['A', 'B', 'C', 'D'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function getLibraryText(data) {
    const { library, chapter, section } = data;
    const arr = [];
    if (library && library.id) {
        arr.push(library.name);
    }
    if (chapter && chapter.id) {
        arr.push(chapter.name);
    }
    if (section && section.id) {
        arr.push(section.name);
    }
    return arr.join(" / ");
}
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" font-size="12">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

export default function Report() {

    const [libraries, setLibraries] = useState([]);
    const [sources, setSources] = useState([]);
    const [difficulty, setDifficulty] = useState('');
    const [skip, setSkip] = useState(0);
    const [records, setRecords] = useState([]);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [questionVisible, setQuestionVisible] = useState(false);
    const [question, setQuestion] = useState({ question: {} });
    const [questionData, setQuestionData] = useState([]);

    const getSettings = () => {
        axios.get('user/getUserSetting').then(res => {
            const { libraries, sources, difficulty, skip } = res.result;
            if (libraries.length > 0) {
                const data = libraries.map(item => {
                    const lib = item.libraryId;
                    const obj = {};
                    if (lib) {
                        obj.library = {
                            id: lib._id,
                            name: lib.name,
                        };
                        if (item.chapterId) {
                            const chapter = lib.chapter.find((x) => x._id === item.chapterId);
                            obj.chapter = {
                                id: chapter._id,
                                name: chapter.name,
                            };
                            if (item.sectionId) {
                                const section = chapter.section.find((x) => x._id === item.sectionId);
                                obj.section = {
                                    id: section._id,
                                    name: section.name,
                                };
                            }
                        }
                    }
                    return obj;
                });
                setLibraries(data);
            }
            if (sources.length > 0) {
                const data = sources.map(item => ({
                    id: item._id,
                    name: item.name,
                }));
                setSources(data);
            }
            setDifficulty(difficulty);
            setSkip(skip);
        });
    }

    const getRecord = () => {
        axios.get('user/getResourceRecord').then(res => {
            const { list } = res.result;
            setRecords(list);
            const correct = list.filter(x => x.isCorrect).length;
            setCorrect(correct);
            setWrong(list.length - correct);
        });
    }

    const openQuestion = (item) => {
        if (!item.question._id) {
            return;
        }
        setQuestion(item);
        setQuestionVisible(true);
    }

    useEffect(() => {
        setQuestionData([
            { name: 'Correct', value: correct },
            { name: 'Incorrect', value: wrong },
            { name: 'Gave up', value: skip },
        ]);
    }, [correct, wrong, skip])

    useEffect(() => {
        getSettings();
        getRecord();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="resources-report">
            <div className="resources-report-setting">
                <div className="resources-report-setting-title">Libraries:</div>
                <div className="resources-report-setting-content">
                    {
                        libraries.map((item, index) => (
                            <div key={index}>
                                {getLibraryText(item)}
                            </div>
                        ))
                    }
                </div>
                <div className="resources-report-setting-title">Sources:</div>
                <div className="resources-report-setting-content">
                    {
                        sources.map((item, index) => (
                            <div key={index}>
                                {item.name}
                            </div>
                        ))
                    }
                </div>
                <div className="resources-report-setting-row">
                    <span>Difficulty: </span>
                    {difficulty}
                </div>
                <div className="resources-report-setting-row">
                    <span>Problems: </span>
                    {records.length}
                </div>
                <div className="resources-report-setting-row">
                    <span>Correct: </span>
                    {correct}
                </div>
                <div className="resources-report-setting-row">
                    <span>Incorrect: </span>
                    {wrong}
                </div>
                <div className="resources-report-setting-row">
                    <span>Gave Up: </span>
                    {skip}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart width={300} height={300}>
                        <Pie
                            dataKey="value"
                            data={questionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            label={renderCustomizedLabel}
                            labelLine={false}
                        >
                            {questionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="top" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="resources-report-content">
                {
                    records.map((item, index) => (
                        <div key={index} className="resources-report-item" onClick={() => openQuestion(item)}>
                            <div className="resources-report-top">
                                {
                                    item.isCorrect ? (
                                        <div className='question-correct-right icon'></div>
                                    ) : (
                                        <div className='question-correct-wrong icon'></div>
                                    )
                                }
                                <div className="resources-report-time">
                                    {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                </div>
                            </div>

                            <div className="resources-report-item-content">
                                {item.question ? filterHtmlTag(item.question.qText) : item.question}
                            </div>
                        </div>
                    ))
                }
            </div>
            <Modal show={questionVisible} onHide={() => setQuestionVisible(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Question Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='question' style={{ marginTop: '0', padding: '0 16px' }} key={question._id}>
                        {/* <div className='question-title' style={{ marginTop: '0' }}>{question.question.name}</div> */}
                        <div className='question-content' dangerouslySetInnerHTML={{ __html: question.question.qText }}></div>
                        {
                            question.question.isChoice === '0' && (
                                <div className='question-options'>
                                    {
                                        options.map((option, index) => (
                                            <Form.Check key={option} type="radio">
                                                <Form.Check.Input
                                                    type="radio"
                                                    checked={question.answer === option}
                                                    disabled />
                                                <Form.Check.Label for={`answer${option}`}>
                                                    <div className='question-option'>
                                                        <div className='label'>{`${option}.`}</div>
                                                        <div className='value' dangerouslySetInnerHTML={{
                                                            __html
                                                                : question[`answer${option}`]
                                                        }}></div>
                                                    </div>
                                                </Form.Check.Label>
                                            </Form.Check>
                                        ))
                                    }
                                    {
                                        Number(question.numChoice) > 4 && (
                                            <Form.Check type="radio">
                                                <Form.Check.Input
                                                    type="radio"
                                                    id="answerE"
                                                    checked={question.answer === 'E'}
                                                    disabled />
                                                <Form.Check.Label for="answerE">
                                                    <div className='question-option'>
                                                        <div className='label'>E.</div>
                                                        <div className='value' dangerouslySetInnerHTML={{
                                                            __html
                                                                : question[`answerE`]
                                                        }}></div>
                                                    </div>
                                                </Form.Check.Label>
                                            </Form.Check>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            question.question.isChoice === '1' && (
                                <div className='question-options'>
                                    {
                                        options.map((option, index) => (
                                            <Form.Check key={option} type="checkbox">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    id={`answer${option}`}
                                                    checked={question.answer.split(',').includes(option)}
                                                    disabled />
                                                <Form.Check.Label for={`answer${option}`}>
                                                    <div className='question-option'>
                                                        <div className='label'>{`${option}.`}</div>
                                                        <div className='value' dangerouslySetInnerHTML={{
                                                            __html
                                                                : question[`answer${option}`]
                                                        }}></div>
                                                    </div>
                                                </Form.Check.Label>
                                            </Form.Check>
                                        ))
                                    }
                                    {
                                        Number(question.numChoice) > 4 && (
                                            <Form.Check type="checkbox">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    id="answerE"
                                                    checked={question.answer.split(',').includes('E')}
                                                    disabled />
                                                <Form.Check.Label for="answerE">
                                                    <div className='question-option'>
                                                        <div className='label'>E.</div>
                                                        <div className='value' dangerouslySetInnerHTML={{
                                                            __html
                                                                : question[`answerE`]
                                                        }}></div>
                                                    </div>
                                                </Form.Check.Label>
                                            </Form.Check>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            question.question.isChoice === '2' && (
                                <div className='question-textarea'>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={question.answer}
                                        disabled
                                    />
                                </div>
                            )
                        }
                        <div className='question-correct'>Correct Answer: {question.question.correctAnswer}</div>
                        <div className='question-corrections'>
                            {question.isCorrect === true && <div className='question-correct-right'></div>}
                            {question.isCorrect === false && <div className='question-correct-wrong'></div>}
                        </div>
                        <div className='question-solution'>
                            <div className='question-sub-title'>Solution</div>
                            <div className='question-content' dangerouslySetInnerHTML={{ __html: question.question.description }}></div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}