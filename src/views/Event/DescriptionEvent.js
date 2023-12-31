import {
  View,
  Panel,
  PanelHeader,
  Group,
  PanelHeaderButton,
  Title,
  Select,
  CardScroll,
  Card,
  HorizontalScroll,
} from "@vkontakte/vkui";
import {
  Icon28ArrowLeftOutline,
  Icon28LikeOutline,
  Icon16Users,
} from "@vkontakte/icons";
import "./DescriptionEvent.scss";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUsersToChat, fetchChatById } from "../../store/reducers/chatSlice";
import { useLocation, matchRoutes } from "react-router-dom";
import { useEffect, useState } from "react";
import RequestAPI from "../../API/requests";
import { months } from "./values";
import { getFullUrlImg } from "../../utils/helpersMethods";

const DescriptionEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [idChat, setIdChat] = useState();
  const [event, setEvent] = useState();
  const [tags, setTags] = useState();
  const [users, setUsers] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [participant, setParticipant] = useState(false);
  const [idUser, setIdUser] = useState();
  const [date, setDate] = useState(new Date());

  const currentUser = useSelector((state) => state.user.user);

  const onJoin = async () => {
    await dispatch(
      addUsersToChat({
        chatId: idChat,
        users: [{ user_id: currentUser.id, role: "user" }],
      })
    );
    goToChat();
  };

  const goToChat = () => {
    navigate(`/messenger/chat/${idChat}`);
  };

  useEffect(() => {
    setIdChat(location.pathname.split("/")[2]);
    RequestAPI.fetchChatById(location.pathname.split("/")[2]).then((e) => {
      setEvent(e?.data?.external);
    });
    RequestAPI.fetchTagsByChatId(location.pathname.split("/")[2]).then((e) =>
      setTags(e?.data)
    );
    RequestAPI.currentUser().then((e) => setIdUser(e?.data?.id));
  }, []);

  useEffect(() => {
    RequestAPI.fetchUsersByChatId(location.pathname.split("/")[2]).then((e) => {
      setUsers(e?.data?.length);
      e?.data?.map((v) => {
        if (v?.user?.id === idUser) {
          setParticipant(true);
          if (v?.role === "admin" && v?.user?.id === idUser) {
            setIsAdmin(true);
          }
        }
      });
    });
  }, [idUser]);

  useEffect(() => {
    console.log(event);
    setDate(new Date(event?.datetime));
  }, [event]);

  return (
    <View id="description" activePanel="description">
      <Panel id="description">
        <PanelHeader
          className="header"
          before={
            <PanelHeaderButton
              onClick={() => navigate("/event")}
              aria-label="back">
              <Icon28ArrowLeftOutline />
            </PanelHeaderButton>
          }>
          <Title>Описание события</Title>
        </PanelHeader>
        <Group className="wrapper">
          <div>
            <div className="eventsImage">
              {event?.avatar ? (
                <img src={getFullUrlImg(event?.avatar)} />
              ) : (
                <div className="noImg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none">
                    <path
                      d="M19 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.1645 21.9977 19.3284 21.981 19.49 21.95L19.79 21.88H19.86H19.91L20.28 21.74L20.41 21.67C20.51 21.61 20.62 21.56 20.72 21.49C20.8535 21.3918 20.9805 21.2849 21.1 21.17L21.17 21.08C21.2682 20.9805 21.3585 20.8735 21.44 20.76L21.53 20.63C21.5998 20.5187 21.6601 20.4016 21.71 20.28C21.7374 20.232 21.7609 20.1818 21.78 20.13C21.83 20.01 21.86 19.88 21.9 19.75V19.6C21.9567 19.4046 21.9903 19.2032 22 19V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2ZM5 20C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V14.69L7.29 11.39C7.38296 11.2963 7.49356 11.2219 7.61542 11.1711C7.73728 11.1203 7.86799 11.0942 8 11.0942C8.13201 11.0942 8.26272 11.1203 8.38458 11.1711C8.50644 11.2219 8.61704 11.2963 8.71 11.39L17.31 20H5ZM20 19C19.9991 19.1233 19.9753 19.2453 19.93 19.36C19.9071 19.4087 19.8804 19.4556 19.85 19.5C19.8232 19.5423 19.7931 19.5825 19.76 19.62L14.41 14.27L15.29 13.39C15.383 13.2963 15.4936 13.2219 15.6154 13.1711C15.7373 13.1203 15.868 13.0942 16 13.0942C16.132 13.0942 16.2627 13.1203 16.3846 13.1711C16.5064 13.2219 16.617 13.2963 16.71 13.39L20 16.69V19ZM20 13.86L18.12 12C17.5477 11.457 16.7889 11.1543 16 11.1543C15.2111 11.1543 14.4523 11.457 13.88 12L13 12.88L10.12 10C9.54772 9.45699 8.7889 9.15428 8 9.15428C7.2111 9.15428 6.45228 9.45699 5.88 10L4 11.86V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V13.86ZM13.5 6C13.2033 6 12.9133 6.08797 12.6666 6.2528C12.42 6.41762 12.2277 6.65189 12.1142 6.92597C12.0006 7.20006 11.9709 7.50166 12.0288 7.79264C12.0867 8.08361 12.2296 8.35088 12.4393 8.56066C12.6491 8.77044 12.9164 8.9133 13.2074 8.97118C13.4983 9.02906 13.7999 8.99935 14.074 8.88582C14.3481 8.77229 14.5824 8.58003 14.7472 8.33335C14.912 8.08668 15 7.79667 15 7.5C15 7.10218 14.842 6.72064 14.5607 6.43934C14.2794 6.15804 13.8978 6 13.5 6Z"
                      fill="#1B1B1B"
                    />
                  </svg>
                </div>
              )}
              <div className="infoImage">
                <PanelHeaderButton
                  aria-label="favorites"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(idChat);
                    console.log(date);
                  }}
                >
                  <Icon28LikeOutline fill="white" style={{ padding: "0px" }} />
                </PanelHeaderButton>
              </div>
              <HorizontalScroll size="false" className="tags">
                {/* <Card> */}
                <div>
                  {tags?.slice(0, 3).map((e) => {
                    return (
                      <div className="tag" key={e?.tag_id}>
                        {e?.title}
                      </div>
                    );
                  })}
                </div>
                {/* </Card> */}
              </HorizontalScroll>
            </div>
          </div>
          <div className="info">
            <div className="title">
              <p>{event?.title}</p>
              <div>
                <span>{users}</span>
                <PanelHeaderButton aria-label="users">
                  <Icon16Users />
                </PanelHeaderButton>
              </div>
            </div>
            <div className="time">
              <p>
                {date.getDate()} {months[date.getMonth()]}, {date.getHours()}:
                {date.getMinutes()}
              </p>
              <p>{event?.place}</p>
            </div>
          </div>
          <div className="desc">
            <p>{event?.description}</p>
            <div className="btns">
              {isAdmin && (
                <>
                  <button
                    className="btn"
                    onClick={() => navigate(`/messenger/chat/${idChat}`)}>
                    Чат
                  </button>
                  <button
                    className="btn noActive"
                    onClick={() => navigate(`/event/edit/${idChat}`)}>
                    Редактировать
                  </button>
                </>
              )}
              {participant && !isAdmin && (
                <>
                  <button
                    className="btn"
                    onClick={() => navigate(`/messenger/chat/${idChat}`)}>
                    Чат
                  </button>
                  <button className="btn noActive">Не участвовать</button>
                </>
              )}
              {!isAdmin && !participant && (
                <button className="btn" onClick={onJoin}>
                  Присоединиться
                </button>
              )}
            </div>
          </div>
        </Group>
      </Panel>
    </View>
  );
};

export default DescriptionEvent;
