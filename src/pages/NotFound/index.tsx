import React from 'react'
import "./index.sass"
import { Badge, Button } from '@attrybtech/attryb-ui'
export default function NotFound() {
  return (
    <div className='page-not-found-container'>
      <div className="background-svg"></div>
      <div className="page-not-found-content">
          <Badge 
            isDot={true} 
            labelColor="var(--color--black-standard)"
            backgroundColor="var(--color--main-white)"
            borderColor="var(--color--grey-off)"
            dotColor="var(--color-primary-faint-light)" 
            labelText='404 error' />
            
        <h2 className='error-header display-xl--sb'>We can’t find this page</h2>
        <p className="error-description text-xl">The page you are looking for doesn't exist or has been moved.</p>
        <div className="nevigation-buttons">
          <a href="/">
            <Button><p className="text-lg--sb">Go home</p></Button>
          </a>
        </div>
        <div className="navigation-pages">
          <svg className='horizontal-line' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 592 1" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M592 1H0V0H592V1Z" fill="#EAECF0"/> </svg>
          <a href="https://attryb.com/">
            <div className='nevigate-page'>
                <svg className='nevigation-icon' width="48" height="48" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d_829_206)"> <rect x="2" y="1" width="48" height="48" rx="10" fill="white"/> <rect x="2.5" y="1.5" width="47" height="47" rx="9.5" stroke="#EAECF0"/> <path d="M34.5 20.2778L26 25M26 25L17.5 20.2778M26 25L26 34.5M35 29.0586V20.9415C35 20.5988 35 20.4275 34.9495 20.2747C34.9049 20.1395 34.8318 20.0154 34.7354 19.9108C34.6263 19.7924 34.4766 19.7092 34.177 19.5428L26.777 15.4317C26.4934 15.2741 26.3516 15.1954 26.2015 15.1645C26.0685 15.1371 25.9315 15.1371 25.7986 15.1645C25.6484 15.1954 25.5066 15.2741 25.223 15.4317L17.823 19.5428C17.5234 19.7092 17.3737 19.7924 17.2646 19.9108C17.1682 20.0154 17.0951 20.1395 17.0505 20.2747C17 20.4275 17 20.5988 17 20.9415V29.0586C17 29.4012 17 29.5725 17.0505 29.7253C17.0951 29.8605 17.1682 29.9846 17.2646 30.0893C17.3737 30.2076 17.5234 30.2908 17.823 30.4572L25.223 34.5683C25.5066 34.7259 25.6484 34.8047 25.7986 34.8356C25.9315 34.8629 26.0685 34.8629 26.2015 34.8356C26.3516 34.8047 26.4934 34.7259 26.777 34.5683L34.177 30.4572C34.4766 30.2908 34.6263 30.2076 34.7354 30.0893C34.8318 29.9846 34.9049 29.8605 34.9495 29.7253C35 29.5725 35 29.4012 35 29.0586Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <filter id="filter0_d_829_206" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="1"/> <feGaussianBlur stdDeviation="1"/> <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_829_206"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_829_206" result="shape"/> </filter> </defs> </svg>
                <div className='nevigation-text'>
                  <h3 className='text-xl--sb'>Documentation</h3>
                  <p className='text-md'>Dive in to learn all about our product.</p>
                </div>
            </div>
          </a>
          <svg className='horizontal-line' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 592 1" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M592 1H0V0H592V1Z" fill="#EAECF0"/> </svg>
          <a href="https://attryb.com/">
            <div className='nevigate-page'>
                <svg className='nevigation-icon' width="48" height="48" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d_829_216)"> <rect x="2" y="1" width="48" height="48" rx="10" fill="white"/> <rect x="2.5" y="1.5" width="47" height="47" rx="9.5" stroke="#EAECF0"/> <path d="M26 34L25.8999 33.8499C25.2053 32.808 24.858 32.287 24.3991 31.9098C23.9929 31.5759 23.5248 31.3254 23.0216 31.1726C22.4533 31 21.8271 31 20.5748 31H19.2C18.0799 31 17.5198 31 17.092 30.782C16.7157 30.5903 16.4097 30.2843 16.218 29.908C16 29.4802 16 28.9201 16 27.8V19.2C16 18.0799 16 17.5198 16.218 17.092C16.4097 16.7157 16.7157 16.4097 17.092 16.218C17.5198 16 18.0799 16 19.2 16H19.6C21.8402 16 22.9603 16 23.816 16.436C24.5686 16.8195 25.1805 17.4314 25.564 18.184C26 19.0397 26 20.1598 26 22.4M26 34V22.4M26 34L26.1001 33.8499C26.7947 32.808 27.142 32.287 27.6009 31.9098C28.0071 31.5759 28.4752 31.3254 28.9784 31.1726C29.5467 31 30.1729 31 31.4252 31H32.8C33.9201 31 34.4802 31 34.908 30.782C35.2843 30.5903 35.5903 30.2843 35.782 29.908C36 29.4802 36 28.9201 36 27.8V19.2C36 18.0799 36 17.5198 35.782 17.092C35.5903 16.7157 35.2843 16.4097 34.908 16.218C34.4802 16 33.9201 16 32.8 16H32.4C30.1598 16 29.0397 16 28.184 16.436C27.4314 16.8195 26.8195 17.4314 26.436 18.184C26 19.0397 26 20.1598 26 22.4" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <filter id="filter0_d_829_216" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="1"/> <feGaussianBlur stdDeviation="1"/> <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_829_216"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_829_216" result="shape"/> </filter> </defs> </svg>
                <div className='nevigation-text'>
                  <h3 className='text-xl--sb'>Our blog</h3>
                  <p className='text-md'>Read the latest posts on our blog.</p>
                </div>
            </div>
          </a>
          <svg className='horizontal-line' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 592 1" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M592 1H0V0H592V1Z" fill="#EAECF0"/> </svg>
          <a href="https://attryb.com/">
            <div className='nevigate-page'>
                <svg className='nevigation-icon' width="48" height="48" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d_829_226)"> <rect x="2" y="1" width="48" height="48" rx="10" fill="white"/> <rect x="2.5" y="1.5" width="47" height="47" rx="9.5" stroke="#EAECF0"/> <path d="M20.0944 24.2288C20.0322 23.8282 20 23.4179 20 23C20 18.5817 23.6052 15 28.0526 15C32.4999 15 36.1052 18.5817 36.1052 23C36.1052 23.9981 35.9213 24.9535 35.5852 25.8345C35.5154 26.0175 35.4804 26.109 35.4646 26.1804C35.4489 26.2512 35.4428 26.301 35.4411 26.3735C35.4394 26.4466 35.4493 26.5272 35.4692 26.6883L35.8717 29.9585C35.9153 30.3125 35.9371 30.4895 35.8782 30.6182C35.8266 30.731 35.735 30.8205 35.6211 30.8695C35.4911 30.9254 35.3146 30.8995 34.9617 30.8478L31.7765 30.3809C31.6101 30.3565 31.527 30.3443 31.4512 30.3448C31.3763 30.3452 31.3245 30.3507 31.2511 30.3661C31.177 30.3817 31.0823 30.4172 30.893 30.4881C30.0097 30.819 29.0524 31 28.0526 31C27.6344 31 27.2237 30.9683 26.8227 30.9073M21.6316 35C24.5965 35 27 32.5376 27 29.5C27 26.4624 24.5965 24 21.6316 24C18.6667 24 16.2632 26.4624 16.2632 29.5C16.2632 30.1106 16.3603 30.6979 16.5395 31.2467C16.6153 31.4787 16.6532 31.5947 16.6657 31.6739C16.6786 31.7567 16.6809 31.8031 16.6761 31.8867C16.6714 31.9668 16.6514 32.0573 16.6113 32.2383L16 35L18.9948 34.591C19.1583 34.5687 19.24 34.5575 19.3114 34.558C19.3865 34.5585 19.4264 34.5626 19.5001 34.5773C19.5701 34.5912 19.6742 34.6279 19.8823 34.7014C20.4306 34.8949 21.0191 35 21.6316 35Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <filter id="filter0_d_829_226" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="1"/> <feGaussianBlur stdDeviation="1"/> <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_829_226"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_829_226" result="shape"/> </filter> </defs> </svg>
                <div className='nevigation-text'>
                  <h3 className='text-xl--sb'>Chat to us</h3>
                  <p className='text-md'>Can’t find what you’re looking for?</p>
                </div>
            </div>
          </a>
          <svg className='horizontal-line' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 592 1" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M592 1H0V0H592V1Z" fill="#EAECF0"/> </svg>
        </div>
      </div>
    </div>
  )
}