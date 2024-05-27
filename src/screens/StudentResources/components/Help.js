import React, { useEffect, useState } from 'react';
import Loader from '../../../components/Loader';
import axios from '../../../utils/axios';
import '../index.css';

const Help = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const getHelpContent = () => {
        setLoading(true);
        axios.get('/public/getResourceBase').then(res => {
            setContent(res.result.helpContent);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        getHelpContent();
    }, [])

    return (
        <div className="help">
            {
                loading ? <Loader /> : <div className="rich-text" dangerouslySetInnerHTML={{ __html: content }} />
            }
        </div>
    )
}

export default Help;