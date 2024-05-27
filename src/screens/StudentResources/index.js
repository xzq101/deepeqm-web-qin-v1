import React, { useState } from "react";
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Play from "./components/Play";
import Settings from './components/Settings';
import Report from "./components/Report";
import Profile from "./components/Profile";
import Help from "./components/Help";
import './index.css';

export default function StudentResources() {

    const [tab, setTab] = useState(0);
    const [tabs, setTabs] = useState(['PLAY', 'HISTORY', 'REPORT', 'HELP', 'SETTINGS'])

    return (
        <div className="resources-container">
            <div className="resources-menu-container">
                <MenuList dense variant="menu" className="resources-menu">
                    {
                        tabs.map((item, index) => (
                            <MenuItem key={item} onClick={() => setTab(index)} selected={tab === index}>
                                <ListItemText inset>{item}</ListItemText>
                            </MenuItem>
                        ))
                    }
                </MenuList>
            </div>
            <div className="resources-content">
                {
                    tab === 0 && <Play />
                }
                {
                    tab === 1 && <Profile />
                }
                {
                    tab === 2 && <Report />
                }
                {
                    tab === 3 && <Help />
                }
                {
                    tab === 4 && <Settings />
                }
            </div>
        </div>
    )
}