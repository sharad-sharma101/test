
let elementContainer;
window.addEventListener("load",(e)=>{
	elementContainer= document.createElement("div")
	try {
		if (window.top !== window) {
			window.top.postMessage({ message:"script-loaded" }, "https://personalization.attryb.com");
			// temporary here to send messages the iframe, we have to segregate this function
			window.addEventListener(
				"message",
				(event) => {
					if (event.data.messageType === "render-use-case") {

						const PATH_NAMES = {
							home:'/',
							collection:'/collections',
							products:'/products',
							cart:'/cart',
							checkout:'/checkouts',
							blogs:'/blogs'
						}
						
						const PAGE_TYPES = {
							home:'HOME_PAGE',
							collection:'COLLECTION_PAGE',
							products:'PRODUCT_PAGE',
							cart:'CART_PAGE',
							checkout:'CHECKOUT_PAGE',
							blogs:'BLOG_PAGE'
						}
						
						function identifyPage(){
							const pathName = location.pathname
							
							if( pathName === PATH_NAMES.home ) return PAGE_TYPES.home
							if( pathName.includes(PATH_NAMES.products) ) return PAGE_TYPES.products
							if( pathName.includes(PATH_NAMES.collection) ) return PAGE_TYPES.collection
							if( pathName.includes(PATH_NAMES.cart) ) return PAGE_TYPES.cart
							if( pathName.includes(PATH_NAMES.checkout) ) return PAGE_TYPES.checkout
							if( pathName.includes(PATH_NAMES.blogs) ) return PAGE_TYPES.blogs
						
						}
						const template = event?.data?.data?.template ||{ html:"", css:"",_id:""};
						const placement = event?.data?.data?.placement;

						const pages = event?.data?.data?.pages || [];
						const page = identifyPage()
						
							if(pages.includes(page) ){
								if(template && template?.html ){
									const {html, css, _id, script} = template				
									const isElm = document.getElementById(_id)

									if(isElm) {
										isElm.children[0].remove()
										const styleElmCheck = document.querySelector(`style[template-style-id='${_id}']`)
										styleElmCheck?.remove()

										const isScriptContianer =  document.querySelector(`script[template-script-id='${_id}']`)
										isScriptContianer?.remove()
									}

									// if(!isElm){
										elementContainer.setAttribute("id", _id)
										
										elementContainer.children[0]?.setAttribute("data-preview-mode", true);

										elementContainer.innerHTML = html
										elementContainer.style.width = "100%"
										
										const styleElm = document.createElement('style')
										styleElm.setAttribute("template-style-id", _id )
										styleElm.innerText=css
										elementContainer.children[0]?.setAttribute("data-preview-mode", true);
										document.body.prepend(elementContainer)
										document.body.prepend(styleElm)
										const scriptContianer = document.createElement("script");
										scriptContianer.setAttribute("template-script-id", _id)
										scriptContianer.textContent = script;
										document.body.prepend(scriptContianer);
										if(placement?.value)
											elementContainer.children[0].children[0].style.cssText = placement.value;
									// }

								}
							}

					}
	
					if (event.data?.messageType === "placments") {

						const styles = event?.data?.data?.styles || "" ;
						const template = event?.data?.data?.template ||{ html:"", css:"",_id:""};
						const { _id} = template
						const isElm = document.getElementById(_id)

						if(isElm){
							isElm.children[0].children[0].style.cssText = styles;
						}
					}
				},
				false
			);
		}
	} catch (error) {
		console.log(error);
	}
})


