import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Modal, Table, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { getEditorConfig, toolbarConfig } from '../config/editor-config';
import Message from "../components/Message";
import axios from '../utils/axios';

const LoginScreen = ({ location, history }) => {

    const [title, setTitle] = useState('');
    const [editor, setEditor] = useState(null);
    const [content, setContent] = useState('');
    const [recipient, setRecipient] = useState([]);
    const userRef = useRef([]);
    const [visibleRecipient, setVisibleRecipient] = useState(false);
    const [user, setUser] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [group, setGroup] = useState([]);
    const [groups, setGroups] = useState([]);
    const groupRef = useRef([]);
    const [searchGroupText, setSearchGroupText] = useState('');
    const [visibleGroup, setVisibleGroup] = useState(false);
    const [visibleAddGroup, setVisibleAddGroup] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [groupUser, setGroupUser] = useState([]);
    const [allGroupUserChecked, setAllGroupUserChecked] = useState(false);
    const [searchGroupUserText, setSearchGroupUserText] = useState('');
    const [groupName, setGroupName] = useState('');
    const [currentGroup, setCurrentGroup] = useState({});
    const [allGroupChecked, setAllGroupChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const editorConfig = getEditorConfig();
    

    const getUserList = () => {
        axios.get('/admin/getUsers').then(res => {
            const data = res.result.list;
            data.forEach(item => {
                item.checked = false;
            });
            setUser([...data]);
            userRef.current = [...data];
        })
    }

    const getGroupList = () => {
        axios.get('/admin/getGroupEmails').then(res => {
            const data = res.result.list;
            data.forEach(item => {
                item.checked = false;
            });
            setGroup([...data]);
            groupRef.current = [...data];
        })
    }

    const submitHandler = e => {
        e.preventDefault();
        if (!title) {
            alert('Please input title');
            return;
        }
        if (!content) {
            alert('Please input content');
            return;
        }
        if (!recipient.length && !groups.length) {
            alert('Please select recipients');
            return;
        }
        const data = {
            title,
            content,
            recipient,
            emailGroup: groups.map(q => q._id)
        }
        setLoading(true);
        setError('');
        setSuccess('');
        axios.post('/admin/sendEmail', data).then(res => {
            setLoading(false);
            const { result } = res;
            if (result.status === '2') {
                setError('Email sent failed');
            } else if (result.status === '3') {
                setError(`${result.failEmails.join(', ')} sent failed`);
            } else if (result.status === '1') {
                setSuccess('Email sent successfully');
            }
            setTitle('');
            setContent('');
            setRecipient([]);
            setGroups([]);
            editor.clear();
        });
    };

    const openRecipientModal = () => {
        setVisibleRecipient(true);
        userRef.current.forEach(item => {
            item.checked = recipient.includes(item.email);
        });
    }

    const reset = () => {
        const list = [...userRef.current];
        list.forEach(item => {
            item.checked = false;
        });
        setUser([...list]);
        setSearchText('');
        setGroupName('');
        setGroupUser([]);
        setAllChecked(false);
        setAllGroupUserChecked(false);
        setSearchGroupUserText('');
    }

    const closeRecipientModal = () => {
        setVisibleRecipient(false);
        reset();
    }

    const submitRecipinet = () => {
        const list = [...userRef.current];
        const emails = list.filter(q => q.checked).map(q => q.email);
        setRecipient(emails);
        closeRecipientModal();
    }

    const selectRecipient = (id) => {
        const index = user.findIndex(item => item._id === id);
        const data = [...user];
        data[index].checked = !data[index].checked;
        setUser(data);
        const index2 = userRef.current.findIndex(item => item._id === id);
        userRef.current[index2].checked = data[index].checked;
    }

    const openGroupModal = () => {
        setVisibleGroup(true);
    }

    const closeGroupModal = () => {
        setVisibleGroup(false);
    }

    const selectGroup = (id) => {
        const index = group.findIndex(item => item._id === id);
        const data = [...group];
        data[index].checked = !data[index].checked;
        setGroup(data);
        const index2 = groupRef.current.findIndex(item => item._id === id);
        groupRef.current[index2].checked = data[index].checked;
    }

    const submitGroup = () => {
        const list = [...groupRef.current];
        const gs = list.filter(q => q.checked);
        setGroups([...gs]);
        closeGroupModal();
    }

    const deleteGroup = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure to delete this group?')) {
            axios.post('/admin/deleteGroupEmail', { id }).then(res => {
                getGroupList();
            });
        }
    }

    const editGroup = (e, id) => {
        e.stopPropagation();
        const cg = group.find(q => q._id === id);
        const recipients = cg.recipient;
        const list = [...userRef.current];
        const currentGroupUser = list.filter(q => recipients.includes(q._id));
        setGroupUser([...currentGroupUser]);
        setGroupName(cg.name);
        setVisibleAddGroup(true);
        setCurrentGroup(cg);
    }

    const addGroup = () => {
        setVisibleAddGroup(true);
        setCurrentGroup({})
    }

    const openAddGroupModal = () => {
        setVisibleAddGroup(true);
    }

    const closeAddGroupModal = () => {
        reset();
        setVisibleAddGroup(false);
    }

    const submitAddGroup = () => {
        if (!groupName) {
            alert('Please input group name');
            return;
        }
        if (!groupUser.length) {
            alert('Please select users');
            return;
        }
        if (currentGroup._id) {
            axios.post('/admin/editGroupEmail', { id: currentGroup._id, name: groupName, users: groupUser.map(q => q._id) }).then(res => {
                closeAddGroupModal();
                getGroupList();
            });
        } else {
            axios.post('/admin/addGroupEmail', { name: groupName, users: groupUser.map(q => q._id) }).then(res => {
                closeAddGroupModal();
                getGroupList();
            });
        }
        
    }

    const allSelect = () => {
        const list = [...user];
        list.forEach(q => {
            q.checked = !allChecked;
            const q2 = userRef.current.find(q2 => q2._id === q._id);
            q2.checked = q.checked;
        });

        setUser(list);
        setAllChecked(!allChecked);
    }

    const batchAdd = () => {
        const list = [...userRef.current];
        const newList = list.filter(q => {
            if (q.checked) {
                q.checked = false;
                return true;
            }
            return false;
        });
        setGroupUser([...groupUser, ...newList]);
    }

    const batchDelete = () => {
        const list = [...groupUser];
        const newList = list.filter(q => {
            if (q.checked) {
                q.checked = false;
                return false;
            }
            return true;
        });
        setGroupUser([...newList]);
    }

    const selectGroupUser = (id) => {
        const index = groupUser.findIndex(item => item._id === id);
        const data = [...groupUser];
        data[index].checked = !data[index].checked;
        setGroupUser(data);
    }

    const allGroupUserSelect = () => {
        const list = [...groupUser];
        list.forEach(q => {
            q.checked = !allGroupUserChecked;
        });
        setGroupUser(list);
        setAllGroupUserChecked(!allGroupUserChecked);
    }

    const allSelectGroup = () => {
        const list = [...group];
        list.forEach(q => {
            q.checked = !allGroupChecked;
        });
        setGroup(list);
        setAllGroupChecked(!allGroupChecked);
    }

    useEffect(() => {
        getUserList();
        getGroupList();
    }, []);

    useEffect(() => {
        if (!searchText) {
            setUser([...userRef.current]);
        } else {
            const list = [...userRef.current];
            const newList = list.filter(q => (q.name.toLowerCase().includes(searchText.toLowerCase()) || q.email.toLowerCase().includes(searchText.toLowerCase())));
            setUser(newList);
        }
    }, [searchText]);

    useEffect(() => {
        if (!searchGroupUserText) {
            const list = [...userRef.current];
            const newList = list.filter(q => !groupUser.find(q2 => q2._id === q._id));
            setUser(newList);
        } else {
            const list = [...userRef.current];
            let newList = list.filter(q => (q.name.toLowerCase().includes(searchGroupUserText.toLowerCase()) || q.email.toLowerCase().includes(searchGroupUserText.toLowerCase())));
            newList = newList.filter(q => !groupUser.find(q2 => q2._id === q._id));
            setUser(newList);
        }
    }, [groupUser, searchGroupUserText]);

    useEffect(() => {
        if (!searchGroupText) {
            setGroup([...groupRef.current]);
        } else {
            const list = [...groupRef.current];
            const newList = list.filter(q => q.name.toLowerCase().includes(searchGroupText.toLowerCase()));
            setGroup(newList);
        }
    }, [searchGroupText]);

    useEffect(() => {
        return () => {
          if (editor == null) return;
          editor.destroy();
          setEditor(null);
    
        }
      }, [editor]);

    return (
        <div>
            { error && <Message variant='danger'>{error}</Message> }
            { success && <Message variant='success'>{success}</Message> }
            <h1>Email</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        placeholder="Enter title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="recipient">
                    <Form.Label>Recipient</Form.Label>
                    <div onClick={openRecipientModal}>
                        <Form.Control
                            placeholder="Select Recipient"
                            value={recipient.join(', ')}
                            disabled
                        />
                    </div>
                </Form.Group>
                <Form.Group controlId="group">
                    <Form.Label>Group</Form.Label>
                    <div onClick={openGroupModal}>
                        <Form.Control
                            placeholder="Select Group"
                            value={groups.map(item => item.name).join(', ')}
                            disabled
                        />
                    </div>
                </Form.Group>
                <Form.Group controlId="content">
                    <Form.Label>Content</Form.Label>
                    <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                        <Toolbar
                            editor={editor}
                            defaultConfig={toolbarConfig}
                            mode="default"
                            style={{ borderBottom: '1px solid #ccc' }}
                        />
                        <Editor
                            defaultConfig={editorConfig}
                            value={content}
                            onCreated={setEditor}
                            onChange={editor => setContent(editor.getHtml())}
                            mode="default"
                            style={{ height: '500px', overflowY: 'hidden' }}
                        />
                    </div>
                </Form.Group>

                <Button type="submit" variant="primary" disabled={loading}>
                    {
                        loading ? <Spinner animation="border" size="sm" /> : 'Send'
                    }
                </Button>
            </Form>
            <Modal show={visibleRecipient} onHide={closeRecipientModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='transfer-search'>
                        <Form.Control
                            type="text"
                            placeholder="user name or email"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)} />
                    </div>
                    <div style={{ height: '600px', overflowY: 'auto' }}>
                        <Table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.map(cl => (
                                    <tr key={cl._id} onClick={() => selectRecipient(cl._id)}>
                                        <td><input type="checkbox" checked={cl.checked} /></td>
                                        <td>{cl.name}</td>
                                        <td>{cl.email}</td>
                                        <td>{cl.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeRecipientModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submitRecipinet}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={visibleGroup} onHide={closeGroupModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'right' }}>
                        <Button size="sm" variant="primary" onClick={addGroup}> <i className='fas fa-plus'></i>Add Group</Button>
                    </div>
                    <div className='transfer-search'>
                        <Form.Control
                            type="text"
                            placeholder="group name"
                            value={searchGroupText}
                            onChange={e => setSearchGroupText(e.target.value)} />
                    </div>
                    <div style={{ height: '600px', overflowY: 'auto' }}>
                        <Table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" checked={allGroupChecked} onClick={allSelectGroup} /></th>
                                    <th width="350">Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.map(cl => (
                                    <tr key={cl._id} onClick={() => selectGroup(cl._id)}>
                                        <td><input type="checkbox" checked={cl.checked} /></td>
                                        <td>{cl.name}</td>
                                        <td>
                                            <Button size="sm" variant="primary" style={{ marginRight: '10px' }} onClick={(e) => editGroup(e, cl._id)}>Edit</Button>
                                            <Button size="sm" variant="danger" onClick={(e) => deleteGroup(e, cl._id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeGroupModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submitGroup}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={visibleAddGroup} onHide={closeAddGroupModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="groupName">
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control
                                placeholder="Enter group name"
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                            />
                    </Form.Group>
                    <div className='transfer-container'>
                        <div className='transfer-content'>
                            <div className='transfer-content-header'>
                                <input type='checkbox' checked={allChecked} onClick={allSelect} />
                            </div>
                            <div className='transfer-search'>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name or email"
                                    value={searchGroupUserText}
                                    onChange={e => setSearchGroupUserText(e.target.value)} />
                            </div>
                            <div className='transfer-list'>
                                {
                                    user.map((q, index) => (
                                        <div className='transfer-list-item' key={q._id} onClick={() => selectRecipient(q._id)}>
                                            <input type='checkbox' checked={q.checked} />
                                            <div className='transfer-list-text'>{q.name}({q.email})</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className='transfer-btns'>
                            <Button type="submit" variant="primary" onClick={batchDelete}>
                                <i className="fas fa-arrow-left" />
                            </Button>
                            <Button type="submit" variant="primary" onClick={batchAdd}>
                                <i className="fas fa-arrow-right" />
                            </Button>
                        </div>
                        <div className='transfer-content'>
                            <div className='transfer-content-header'>
                                <input type='checkbox' checked={allGroupUserChecked} onClick={allGroupUserSelect} />
                            </div>
                            <div className='transfer-list'>
                                {
                                    groupUser.map((q, index) => (
                                        <div className='transfer-list-item' key={q._id} onClick={() => selectGroupUser(q._id)}>
                                            <input type='checkbox' checked={q.checked} />
                                            <div className='transfer-list-text'>{q.name}({q.email})</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeAddGroupModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submitAddGroup}>
                        {currentGroup._id ? 'Edit' : 'Add'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LoginScreen;
