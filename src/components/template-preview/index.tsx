// @ts-nocheck
import React from 'react';
import GreyContainer from '../grey-box';
import "./index.sass"
import { renderToString } from 'react-dom/server'
import * as ReactDOMServer from 'react-dom/server';
import desktopSkeleton from '/src/assets/preview-skeletons/desktop-skeleton.svg';
import tabletSkeleton from '/src/assets/preview-skeletons/tablet-skeleton.svg';
import mobileSkeleton from '/src/assets/preview-skeletons/mobile-skeleton.svg';
import DomainHeader from '../DomainHeader';
import templateDataJSON from "../../data/template-data.json"
import {templateGeneralizedFunction} from '../../template-generalized-functions/template-functions.js';

type Props = {
  device: string;
  template: Template;
  style?: React.CSSProperties;
};

const TemplatePreview: React.FC<Props> = ({ device, template ,style }) => {

  function handleDevice() {
    const desktop = [1, 2, 3, 4, 5, 6];
    const tablet = [1, 2, 3, 4];
    const mobile = [1, 2, 3];


    templateGeneralizedFunction()
    const parser = new DOMParser();
    let templateDoc = parser?.parseFromString(template.html, 'text/html').querySelector('div');
    templateDoc?.setAttribute("data-template-display", `${JSON.stringify(templateDataJSON)}`)
    templateDoc?.setAttribute("data-preview-mode", 'true')
    templateDoc = window.attryb.convertDomToString(templateDoc)


    const templateHTML = `
    ${templateDoc}
    <div class='template-skeleton'></div>
    <style>
    ${template.css}
    html{
      overflow:hidden;
      pointer-events: none;
    }
    .template-skeleton{
      width:100%;
      height:100%;
      box-sizing: border-box;
    }
    .template-skeleton > .skeleton-img{
      width:100%;
      height:100%;
    }
    </style>
    <script>
    (${templateGeneralizedFunction.toString()})()
    ${template?.isDynamic ?  template?.script : ""}

      const skeletonContainer = document.querySelector(".template-skeleton");
      if ("${device}" === "desktop") {
        skeletonContainer.innerHTML = \`<img class="skeleton-img" src="${desktopSkeleton}" alt="Desktop Skeleton" />\`;
      } else if ("${device}" === "tablet") {
        skeletonContainer.innerHTML = '<img class="skeleton-img" src="${tabletSkeleton}" alt="Tablet Skeleton" />';
      } else {
        skeletonContainer.innerHTML = '<img class="skeleton-img" src="${mobileSkeleton}" alt="Mobile Skeleton" />';
      }
    </script>
  `;
    return (
    <>
    <DomainHeader contentEditable={false} device='desktop' />
        <div className={`${device}-placement-wrapper placement--wrapper`}>
          <iframe className="preview-iframe" srcDoc={templateHTML} frameBorder="0" ></iframe> 
        </div>
    </>
    )
   
  }

  return <>{handleDevice()}</>;
};

export default TemplatePreview;