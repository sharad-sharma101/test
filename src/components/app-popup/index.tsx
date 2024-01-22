import { AlertPopup, AlertPopupHeader, AlertPopupBody, AlertPopupFooter, useModal } from "@attrybtech/attryb-ui"
import "./index.sass"

interface Props {
    header: React.ReactElement<{ className: string }>;
    body: React.ReactElement<{ className: string }>;
    footer: React.ReactElement<{ className: string }>;
    openModal: boolean;
    setOpenModal: Function;
};

const AppPopup = ({ header, body, footer, openModal, setOpenModal }: Props) => {

    const { modalState, modalRef, exitModal } = useModal();
    const modalCancelHandler: () => void = () => { setOpenModal(false); exitModal(); }

    return (
        <div className='popup-wrapper' >
            <AlertPopup
                wrapperRef={modalRef}
                name={`got to enable script`}
                visibility={modalState || openModal}
                onBackdropClick={modalCancelHandler}
            >
                <AlertPopupHeader>
                    {header}
                </AlertPopupHeader>
                <AlertPopupBody>
                    {body}
                </AlertPopupBody>
                <AlertPopupFooter>
                    {footer}
                </AlertPopupFooter>
            </AlertPopup>
        </div>
    )
}

export default AppPopup
