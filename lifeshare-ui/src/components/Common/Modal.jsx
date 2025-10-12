import { useRef, useState, Fragment, createContext, useEffect } from "react";
import "@/components/Common/Modal.css";
import { Button } from "@progress/kendo-react-buttons";
import { Window as KendoWindow } from "@progress/kendo-react-dialogs";

export const modalContext = createContext(null);

const ModalProvider = (props) => {
    const [modal, setModal] = useState({
        type: "alert",
        title: "알림",
        content: "",
        btnList: null,
        show: false,
        isBtnHide: false,
        confirmCallback: null,
        options: null,
    });

    const showAlert = (title, content, options, callback) => {
        setModal((prevState) => ({
            ...prevState,
            type: "alert",
            title,
            content,
            show: true,
            confirmCallback:
                callback != null && callback instanceof Function ? callback : null,
            isBtnHide: options && options.isBtnHide ? options.isBtnHide : false,
        }));
    };

    const showConfirm = (title, content, btnOptions) => {
        setModal((prevState) => ({
            ...prevState,
            type: "confirm",
            title,
            content,
            btnList: btnOptions?.btns ?? null,
            show: true,
            isBtnHide: btnOptions?.isBtnHide ?? false,
            confirmCallback: null,
        }));
    };

    const close = () => {
        setModal((prevState) => ({
            ...prevState,
            show: false,
        }));
    };

    const confirm = (event) => {
        if (modal.confirmCallback && modal.type === "alert") {
            modal.confirmCallback.call(undefined, event);
        }
        close(event);
    };

    return (
        <modalContext.Provider value={{ close, showAlert, showConfirm }} {...props}>
            {props.children}
            <Modal
                type={modal.type}
                show={modal.show}
                title={modal.title}
                content={modal.content}
                btns={modal.btnList}
                isBtnHide={modal.isBtnHide}
                width={400}
                onConfirm={confirm}
                onClose={close}
            />
        </modalContext.Provider>
    );
};

function Modal(props) {
    const windowRef = useRef();

    useEffect(() => {
        if (!props.show || !windowRef.current?.windowElement) return;
        const winEl = windowRef.current.windowElement;

        const actions = winEl.querySelector(".k-window-actions");
        const minBtn = winEl.querySelector(".k-i-window-minimize");
        const maxBtn = winEl.querySelector(".k-i-window-maximize");

        if (actions) actions.classList.add("hide");
        if (minBtn) minBtn.style.display = "none";
        if (maxBtn) maxBtn.style.display = "none";

        winEl.style.top = `calc(50% - ${winEl.offsetHeight / 2}px)`;
    }, [props.show]);

    return (
        <Fragment>
            {props.show ? (
                <KendoWindow
                    ref={windowRef}
                    className="alert-window"
                    title={props.title}
                    initialWidth={props.width}
                    minHeight={200}
                    modal={true}
                    resizable={false}
                    draggable={false}
                    doubleClickStageChange={false}
                    onClose={props.onClose}
                >
                    <div className="content-wrapper popupLayer">
                        <div>
                            {props.content.split("\n").map((item, idx) => (
                                <strong key={idx}>
                                    {item}
                                    <br />
                                </strong>
                            ))}
                        </div>
                    </div>

                    {!props.isBtnHide && (
                        <div className="mt20 ac">
                            {props.type === "alert" ? (
                                <Button
                                    className="btn"
                                    style={{ width: "135px" }}
                                    onClick={props.onConfirm}
                                >
                                    확인
                                </Button>
                            ) : props.btns ? (
                                props.btns.map((item, idx) => (
                                    <Button
                                        key={idx}
                                        className={`btn ${idx !== props.btns.length - 1 ? "mr10" : ""}`}
                                        style={{
                                            width: item.width
                                                ? `${item.width}px`
                                                : "120px",
                                            background:
                                                item.background ??
                                                "rgba(58, 65, 80, 0.3)",
                                        }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            if (item.click instanceof Function) {
                                                item.click.call(undefined, event);
                                            }
                                            props.onClose(event);
                                        }}
                                    >
                                        {item.title}
                                    </Button>
                                ))
                            ) : (
                                <div>
                                    <Button
                                        className="btn mr10"
                                        style={{ background: "rgba(58, 65, 80, 0.3)" }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            props.onConfirm(event);
                                        }}
                                    >
                                        확인
                                    </Button>
                                    <Button
                                        className="btn"
                                        style={{ background: "rgba(58, 65, 80, 0.3)" }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            props.onClose(event);
                                        }}
                                    >
                                        취소
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </KendoWindow>
            ) : null}
        </Fragment>
    );
}

export default ModalProvider;
