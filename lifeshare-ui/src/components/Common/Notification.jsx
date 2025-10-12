import {useState, Fragment, createContext} from 'react';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import Slide from '@mui/material/Slide';

//context 생성
//context를 생성해야지만 전역으로 사용할 수 있음
export const notificationContext = createContext(null);

//Notification 타입 정의
const NotificationTypes = Object.freeze({
    INFO : "info",
    SUCCESS : "success",
    WARNING : "warning",
    ERROR : "error",
    NONE : "none"
});

//타임아웃 설정
const TIMEOUT = 5000;

class NotiQueue {
  constructor() {
      this.arr = [];
  }

  put = (item) => {
      this.arr.push(item);
  }

  get = () => {
      return this.arr.shift();
  }

  size = () => {
      return this.arr.length;
  }
};

const queue = new NotiQueue();

/**
 * @className : NotificationProvider
 * @description : Notification Provider 컴포넌트
 * @date : 2021-03-25 오후 2:43
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history :
**/
const NotificationProvider = (props) => {

    //state 초기화
    const [notification, setNotification] = useState({
        type : NotificationTypes.INFO,
        title : "알림",
        content : "",
        confirmCallback : null,
        show : false
    });

    /**
     * @funcName : info
     * @description : Info Notification을 표출한다.
     * @param title : 제목
     * @param content : 내용
     * @param callback : 닫기 버튼 callback
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 2:47
     * @author : chauki
     * @see
     * @history :
    **/
    const info = (title, content, callback) => {
        setQueue(NotificationTypes.INFO, title, content,callback);
    }

    /**
     * @funcName : success
     * @description : Success Notification을 표출한다.
     * @param type : Notification Type
     * @param title : 제목
     * @param content : 내용
     * @param callback : 닫기 버튼 callback
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 3:06
     * @author : chauki
     * @see
     * @history :
    **/
    const success = (title, content, callback) => {
        setQueue(NotificationTypes.SUCCESS, title, content,callback);
    }

    /**
     * @funcName : error
     * @description : Error Notification을 표출한다.
     * @param type : Notification Type
     * @param title : 제목
     * @param content : 내용
     * @param callback : 닫기 버튼 callback
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 3:06
     * @author : chauki
     * @see
     * @history :
    **/
    const error = (title, content, callback) => {
        setQueue(NotificationTypes.ERROR, title, content,callback);
    }

    /**
     * @funcName : warning
     * @description : Warning Notification을 표출한다.
     * @param type : Notification Type
     * @param title : 제목
     * @param content : 내용
     * @param callback : 닫기 버튼 callback
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 3:07
     * @author : chauki
     * @see
     * @history :
    **/
    const warning = (title, content, callback) => {
        setQueue(NotificationTypes.WARNING, title, content,callback);
    }

    /**
     * @funcName : normal
     * @description : Normal Notification을 표출한다.
     * @param type : Notification Type
     * @param title : 제목
     * @param content : 내용
     * @param callback : 닫기 버튼 callback
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 3:07
     * @author : chauki
     * @see
     * @history :
    **/
    const normal = (title, content, callback) => {
        setQueue(NotificationTypes.NONE, title, content,callback);
    }

    /**
     * @funcName : setQueue
     * @description : Notification 정보를 Queue에 저장한다.
     * @param type : Notification Type
     * @param title : 제목
     * @param content : 내용
     * @param callback : 닫기 버튼 callback
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 4:17
     * @author : chauki
     * @see
     * @history :
    **/
    const setQueue = (type, title, content, callback) => {
        queue.put({
            type : type,
            title : title,
            content : content,
            callback : callback
        });

        //현재 화면에 Notificaition이 없다면 바로 출력
        //있다면, 기존 Notification이 끝나고 난 후, Queue에서 하나씩 표출
        if (!notification.show) {
            getQueue();
        }
    }

    /**
     * @funcName : getQueue
     * @description : Notificaiton 정보룰 Queue에서 하나씩 가져온다.
     * @param :
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 4:18
     * @author : chauki
     * @see
     * @history :
    **/
    const getQueue = () => {
        const item = queue.get();
        createNotification(item.type, item.title, item.content, TIMEOUT, item.callback);
    }

    /**
     * @funcName : createNotification
     * @description : Notification을 생성한다.
     * @param type : Notification Type
     * @param title : 제목
     * @param content : 내용
     * @param callback : 닫기 버튼 callback
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 3:08
     * @author : chauki
     * @see
     * @history :
    **/
    const createNotification = (type, title, content, timeout, callback) => {
        setNotification({
            type : type,
            title : (title !== undefined && title !== null) ? title : "알림",
            content: (content !== undefined && content !== null) ? content : "",
            confirmCallback : (callback != null && callback instanceof Function) ? callback : null,
            show : true
        });

        if (timeout !== undefined && timeout !== null && !Number.isNaN(timeout)) {
            setTimeout(() => {
                setNotification({
                    ...notification,
                    show :  false
                });
                if (queue.size() != 0) {
                    setTimeout(() => {
                        getQueue();
                    }, 1000);
                }
            }, timeout);
        }
    }

    /**
     * @funcName : close
     * @description : Notification을 close 한다.
     * @param :
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 3:10
     * @author : chauki
     * @see
     * @history :
    **/
    const close = () => {
        if (notification.confirmCallback != null) {
            notification.confirmCallback.call();
        }
        setNotification({
            ...notification,
            show : false
        });
    }

    /**
     * @funcName : clear
     * @description : Notification을 초기화한다.
     * @param :
     * @return :
     * @exception :
     * @date : 2021-03-25 오후 3:20
     * @author : chauki
     * @see
     * @history :
    **/
    const clear = () => {
        close();
    }

    return (
        <notificationContext.Provider value={{info, success, warning, error, normal, clear}} {...props}>
            {props.children}
            <NotificationItem
                type={notification.type}
                title={notification.title}
                content={notification.content}
                onClose={close}
                show={notification.show} />
        </notificationContext.Provider>
    );
}

/**
 * @className : NotificationItem
 * @description : Notification 컴포넌트
 * @date : 2021-03-25 오후 3:20
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history :
**/
const NotificationItem = (props) => {
    return (
        <Fragment>
            <NotificationGroup style={{right : "0", bottom : "0", alignItems : "flex-start", flexWrap : "wrap-reverse", padding: "10px"}}>
                <Slide direction="left" in={props.show} mountOnEnter unmountOnExit>
                    <Notification
                        style={{ padding: '10px', width: '250px' }}
                        key={props.type}
                        type={{ style: props.type, icon: true }}
                        closable={true}
                        onClose={props.onClose}
                    >
                        <div>
                            <h4 className="mb15"><b>{props.title}</b></h4>
                            {props.content.split('\n').map((item, idx) => (
                                <span key={idx}>{item}<br /></span>
                            ))}
                        </div>
                    </Notification>
                </Slide>

            </NotificationGroup>
        </Fragment>
    );
}

export default NotificationProvider;