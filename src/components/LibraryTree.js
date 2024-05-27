import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef, useCallback } from "react";
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import clsx from 'clsx';
import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import axios from '../utils/axios';

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
    const {
      classes,
      className,
      label,
      nodeId,
      icon: iconProp,
      expansionIcon,
      displayIcon,
    } = props;
  
    const {
      disabled,
      expanded,
      selected,
      focused,
      handleExpansion,
      handleSelection,
      preventSelection,
    } = useTreeItem(nodeId);
  
    const icon = iconProp || expansionIcon || displayIcon;
  
    const handleMouseDown = (event) => {
      preventSelection(event);
    };
  
    const handleExpansionClick = (event) => {
      handleExpansion(event);
    };
  
    const handleSelectionClick = (event) => {
      handleSelection(event);
    };
  
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={clsx(className, classes.root, {
          [classes.expanded]: expanded,
          [classes.selected]: selected,
          [classes.focused]: focused,
          [classes.disabled]: disabled,
        })}
        onMouseDown={handleMouseDown}
        ref={ref}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div onClick={handleExpansionClick} className={classes.iconContainer}>
          {icon}
        </div>
        <Typography
          onClick={handleSelectionClick}
          component="div"
          className={classes.label}
        >
          {label}
        </Typography>
      </div>
    );
  });

const LibraryTree = forwardRef((props, ref) => {
    const { onChange = () => {}, multiSelect = false, defaultSelected, expandedAll } = props;

    const [libraryList, setLibraryList] = useState([]);

    const [selected, setSelected] = useState(props.selected || (multiSelect ? [] : ''));

    const getLibraryContent = useCallback((selectedId) => {
        let libraryObject = {};
        let chapterObject = {};
        let sectionObject = {};
        let find = false;
        for (let i = 0; i < libraryList.length; i++) {
            const library = libraryList[i];
            libraryObject.id = library._id;
            libraryObject.name = library.name;
            if (library._id === selectedId) {
                find = true;
                break;
            }
            for (let j = 0; j < library.chapter.length; j++) {
                const chapter = library.chapter[j];
                chapterObject.id = chapter._id;
                chapterObject.name = chapter.name;
                if (chapter._id === selectedId) {
                    find = true;
                    break;
                }
                for (let k = 0; k < chapter.section.length; k++) {
                    const section = chapter.section[k];
                    sectionObject.id = section._id;
                    sectionObject.name = section.name;
                    if (section._id === selectedId) {
                        find = true;
                        break;
                    }
                }
                if (find) {
                    break;
                }
                sectionObject = {};
            }
            if (find) {
                break;
            }
            chapterObject = {};
        }
        if (!find) {
            libraryObject = {};
        }
        return {
            library: libraryObject,
            chapter: chapterObject,
            section: sectionObject
        }
    }, [libraryList])

    const [expanded, setExpanded] = useState([]);

    const onNodeSelect = (event, value) => {
        setSelected(value);
        // 找出当前选中的节点及其父节点
        if (multiSelect) {
            const res = [];
            for (let i = 0; i < value.length; i++) {
                const content = getLibraryContent(value[i]);
                res.push(content);
            }
            onChange(res);
        } else {
            onChange(getLibraryContent(value));
        }
    }

    const getLibrary = () => {
        axios.get("/user/getLibrary")
            .then((res) => {
                setLibraryList(res.result.list);
                if (defaultSelected) {
                    onNodeSelect(null, res.result.list[0]._id);
                }
            })
    }

    const onNodeToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    }

    useImperativeHandle(ref, () => ({
        getLibrarySelected: () => {
            if (multiSelect) {
                const res = [];
                for (let i = 0; i < selected.length; i++) {
                    const content = getLibraryContent(selected[i]);
                    res.push(content);
                }
                return res;
            } else {
                return getLibraryContent(selected);
            }
        }
    }));

    useEffect(() => {
        let expandedIds = [];
        if (expandedAll) {
            for (let i = 0; i < libraryList.length; i++) {
                const library = libraryList[i];
                expandedIds.push(library._id);
                for (let j = 0; j < library.chapter.length; j++) {
                    const chapter = library.chapter[j];
                    expandedIds.push(chapter._id);
                    for (let k = 0; k < chapter.section.length; k++) {
                        const section = chapter.section[k];
                        expandedIds.push(section._id);
                    }
                }
            }
        } else {
            if (multiSelect) {
                for (let i = 0; i < selected.length; i++) {
                    const content = getLibraryContent(selected[i]);
                    if (content.library.id) {
                        expandedIds.push(content.library.id);
                    }
                    if (content.chapter.id) {
                        expandedIds.push(content.chapter.id);
                    }
                }
            } else {
                const content = getLibraryContent(selected);
                if (content.library.id) {
                    expandedIds.push(content.library.id);
                }
                if (content.chapter.id) {
                    expandedIds.push(content.chapter.id);
                }
            }
        }
        setExpanded(expandedIds);
    }, [expandedAll, getLibraryContent, libraryList, multiSelect, selected])

    

    useEffect(() => {
        getLibrary();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 400, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          onNodeSelect={onNodeSelect}
          onNodeToggle={onNodeToggle}
          expanded={expanded}
          multiSelect={multiSelect}
          selected={selected}
        >
            {
                libraryList.map((library, index) => (
                    <TreeItem disabled={library.expired} ContentComponent={CustomContent} nodeId={library._id} label={library.name} key={library._id}>
                        {
                            library.chapter.map((chapter, index) => (
                                <TreeItem disabled={library.expired} ContentComponent={CustomContent} nodeId={chapter._id} label={chapter.name} key={chapter._id}>
                                    {
                                        chapter.section.map((section, index) => (
                                            <TreeItem disabled={library.expired} ContentComponent={CustomContent} nodeId={section._id} label={section.name} key={section._id}></TreeItem>
                                        ))
                                    }
                                </TreeItem>
                            ))
                        }
                    </TreeItem>
                ))
            }
        </TreeView>
      );
})

export default LibraryTree;