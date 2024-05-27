import React from 'react';
import Message from '../components/Message';

export const getAnswerResult = (exercise) => {
    const { isCorrect, autoCorrect } = exercise;
    let result;
    if (isCorrect === undefined || isCorrect === null) {
        result = autoCorrect;
    } else {
        result = isCorrect;
    }
    if (result) {
        return <Message variant='success'>Congrats!</Message>;
    } else if (result === false) {
        return <Message variant='danger'>Oops, the answer you submit is incorrect</Message>;
    } else {
        return '';
    }
}

export const getCorrectDetail = (exercise) => {
    const { correctedAt, autoCorrectedAt, isCorrect, autoCorrect } = exercise;
    if (correctedAt) {
        return (
            <div className='question-corrections'>
                <div className='question-sub-title'>Corrections</div>
                {isCorrect === true && <div className='question-correct-right'></div>}
                {isCorrect === false && <div className='question-correct-wrong'></div>}
                <div className='question-content' dangerouslySetInnerHTML={{ __html: exercise.comments }}></div>
            </div>
        )
    } else if (autoCorrectedAt) {
        return (
            <div className='question-corrections'>
                {autoCorrect === true && <div className='question-correct-right'></div>}
                {autoCorrect === false && <div className='question-correct-wrong'></div>}
            </div>
        )
    }
    return '';
}

export const getCorrectResult = (exercise) => {
    const { isCorrect, autoCorrect } = exercise;
    let result;
    if (isCorrect === undefined || isCorrect === null) {
        result = autoCorrect;
    } else {
        result = isCorrect;
    }
    if (result) {
        return <div className='question-correct-right'></div>;
    } else if (result === false) {
        return <div className='question-correct-wrong'></div>;
    }
    return '';
}

export const getCorrectNumber = (cl) => {
    return cl.questionList.filter(q => {
        if (q.isCorrect === undefined || q.isCorrect === null) {
            return q.autoCorrect;
        }
        return q.isCorrect;
    }).length;
}