// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom"
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs/dist/grapes.min.js";
import grapesjs from "grapesjs"; 
import { Button, EditableContentBlock } from "@attrybtech/attryb-ui";

import { getEditorConfigs } from "./configs";
import { getTemplate, updateTemplate, createTemplate } from "./api";
import { COMMANDS, EDITOR_ID, TEMPLATES_TYPES } from "./constants";
import AppHeader from "../header";
import { FiSave, FiChevronRight, FiEdit3 } from "react-icons/fi";
import { useAppDispatch , useAppSelector } from "../../app/hooks";
import "./editor.sass"
import { setTemplate } from "../../features/templates/template-slice";
import { setAlertVisible } from "../../features/globalConfigs/global-slice";
import { parseStringToHtml , convertDomToString} from "../../utils/helpers";
import { setTemplateChange } from "../../features/templates/template-slice";
import phoneIcon from '../../assets/images/placement/phone.svg'
import monitorIcon from '../../assets/images/placement/monitor.svg'
import tabletIcon from "../../assets/images/placement/tablet.svg"
import templateDataJSON from "../../data/template-data.json"
import {templateGeneralizedFunction} from "../../template-generalized-functions/template-functions.js";

interface EditorProps {
  id?: string;
  sectionId?: string;
}

function Editor({ 
  template={},
  sectionId = EDITOR_ID,
  handleSaveTemplate,
  handleSaveAndExit
}) {
  const [selectedWidth, setselectedWidth] = useState(1920)
  const [selectedHeight, setselectedHeight] = useState(1080)
  const [deviceState, setdeviceState] = useState('desktop')
  const [initGjs, setinitGjs] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  let editor = null;
  const {template: selectedTemplate , templateChange  }=useAppSelector((store)=>store.templateConfigs)
  window.onbeforeunload = function () {
    // Your Code here 
     return null;  
   }
  useEffect(() => {
    if(editor === null && !initGjs){
      initEditor();
    }     
    window.addEventListener('resize', calculateHeight);
  }, [selectedTemplate]);
  function transformString(input: string): string {
    const bodyIndex = input.indexOf('body {');
  
    if (bodyIndex !== -1) {
      const endIndex = input.indexOf('}', bodyIndex);
      
      if (endIndex !== -1) {
        const afterBody = input.substring(endIndex + 1).trim();
        return afterBody;
      }
    }
    
    return input;
  }
  const saveTemplateState = () => {
    if(editor && selectedTemplate) {
    
      dispatch(setTemplateChange(true))  
    const updatedHtml = parseStringToHtml(editor?.getHtml()).documentElement.querySelector("body").children[0];
    const htmlInString = convertDomToString(updatedHtml);
    const cssUpdate =  transformString(editor?.getCss())
    const updatedTemplate = {
      ...selectedTemplate,
      css: cssUpdate,
      html: htmlInString
    }
    dispatch(setTemplate(updatedTemplate))
    }
  }
  const initEditor = async () => {
    templateGeneralizedFunction()
    const parser = new DOMParser();
    let templateDoc = parser?.parseFromString(selectedTemplate?.html, 'text/html').querySelector('div');
    templateDoc?.setAttribute("data-template-display", `${JSON.stringify(templateDataJSON)}`)
    templateDoc?.setAttribute("data-preview-mode", 'true')
    templateDoc = window.attryb.convertDomToString(templateDoc)
    let html = selectedTemplate?.isDynamic ? `${templateDoc}<script>(${templateGeneralizedFunction.toString()})() \n ${selectedTemplate?.script}</script>` : templateDoc || ""
    let style = selectedTemplate?.css || ""
    const configs = getEditorConfigs(html, style, sectionId);
    editor = grapesjs.init(configs);
    setinitGjs(true)
    const undoManager = editor.UndoManager;

    // editor.Commands.add('core:component-exit',  {
    //   run(editor, sender, opts = {}) {
    //     const event = opts.event;
    
    //     if (event) {
      
    //     }
    //   },
    // });

    editor.on('change:changesCount', () => {
      saveTemplateState();
    });

    editor.Commands.add('undo', {
        run: function(editor:any, sender:any) {
            undoManager.undo();
        }
    });
    
    editor.Commands.add('redo', {
        run: function(editor:any, sender:any) {
            undoManager.redo();
        }
    });
    
    editor.Panels.addButton('options', [{
        id: 'undo',
        className: 'fa fa-undo custom-pn-option',
        command: 'undo',
        attributes: {
            title: 'Undo'
        }
    }, {
        id: 'redo',
        className: 'fa fa-repeat custom-pn-option',
        command: 'redo',
        attributes: {
            title: 'Redo'
        }
    } , {
      id: 'save',
      className: 'fa fa-save custom-pn-option',
      command: async () => {
        if(editor.getHtml() && selectedTemplate){
        const updatedHtml = parseStringToHtml(editor.getHtml()).documentElement.querySelector("body").children[0];
        const htmlInString = convertDomToString(updatedHtml);
        const cssUpdate =  transformString(editor?.getCss())
        dispatch(setTemplateChange(false))
        dispatch(setTemplate(updatedTemplate))
        await updateTemplate(selectedTemplate._id , {
          css: cssUpdate,
          html: htmlInString
        })
        dispatch(setAlertVisible({content:"Changes Save Successfully",theme:"success",visible:true}))
      }
      },
      attributes: {
          title: 'save'
      }
  }]);    

    editor.getConfig().showDevices = 0;

    editor.Panels.addPanel({ id: "devices-c" }).get("buttons").add([
        { id: "set-device-desktop", command: () => {setselectedHeight(1080); setselectedWidth(1920); setdeviceState('desktop')}, className: `desktop ${deviceState==='desktop' ? '--active' : ''}`, label: `<img src=${monitorIcon} />` , active: 1 },
        { id: "set-device-tablet", command: () => {setselectedHeight(1120); setselectedWidth(1300); setdeviceState('tablet')}, className: `tablet ${deviceState==='tablet' ? '--active' : ''}` , label: `<img src=${tabletIcon} />` },
        { id: "set-device-mobile", command: () => {setselectedHeight(660); setselectedWidth(400); setdeviceState('mobile') }, className: `mobile ${deviceState==='mobile' ? '--active' : ''}`, label: `<img src=${phoneIcon} />` },
    ]);

    editor.render()

    setEditor(editor);
  };
  const handleSaveClick = async () => {
    handleSaveTemplate(editor, templateName);
    // if (editor) editor.runCommand(COMMANDS.save);
  };
  useEffect(() => {
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []); 
  function calculateHeight () {
    const element = document.querySelector('.gjs-cv-canvas')
    const navBarOption = document.querySelector('.gjs-pn-options')
    const currentHeight = element?.offsetHeight ;
    const currentWidth = element?.offsetWidth ;

    const leftShift = Math.abs(currentWidth - (selectedWidth  * (currentHeight/selectedHeight) ))
    const navBarShift = ((currentWidth) / 2 ) - 180 ;
    const styles = `
    .gjs-frame {
      height: ${selectedHeight}px;
      width: ${selectedWidth}px;
      transform: scale(${currentHeight/selectedHeight});
      transform-origin: left;
      left: ${(leftShift)/2}px;
      margin-left: 0px;
    }
    .gjs-pn-options {
      left: calc(${navBarShift}px + 25rem) !important;
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.insertAdjacentElement('beforeend', styleElement);
  }

  calculateHeight()

  return (
    <>
    
    <div className="editor-section" >
      <div id={sectionId.substring(1)} ></div>
    </div>
    </>
  );
}

export default Editor;