import { useState, useEffect } from "react";
import {
  View,
  Panel,
  PanelHeader,
  Group,
  Placeholder,
  PanelHeaderButton,
  Tabs,
  TabsItem,
  HorizontalScroll,
  Title,
  Image,
  FormLayout,
  FormItem,
} from "@vkontakte/vkui";
import {
  Icon28CalendarOutline,
  Icon28AddOutline,
  Icon28SlidersOutline,
  Icon28SearchOutline,
  Icon28LikeOutline,
  Icon16Users,
} from "@vkontakte/icons";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import "./Event.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  activeTabChatSelector,
  chatsSelector,
} from "../../store/selectors/chatSelectors";
import { setActiveTab } from "../../store/reducers/chatSlice";
import { fetchChats } from "./../../store/reducers/chatSlice";

import { changeActiveModal } from "../../store/reducers/modalSlice";
import RequestAPI from "../../API/requests";

const tabs = [
  {
    id: "all_events",
    text: "Все события",
  },
  {
    id: "favorites_events",
    text: "Избранное",
  },
  {
    id: "my_events",
    text: "Мои события",
  },
];

const TabsHeader = ({ selected, setSelected }) => {
  return (
    <Tabs>
      {tabs.map(({ id, text }) => (
        <TabsItem
          selected={selected === id}
          onClick={() => {
            setSelected(id);
          }}
          key={id}
          id={id}
          aria-controls={id}>
          {text}
        </TabsItem>
      ))}
    </Tabs>
  );
};

const Event = () => {
  const navigate = useNavigate();

  const [chats, setChats] = useState();
  const [selected, setSelected] = useState("all_events");
  const dispatch = useDispatch();

  useEffect(() => {
    if (selected === "all_events") {
      RequestAPI.fetchUserEvents().then((e) => setChats(e?.data));
    }
    if (selected === "my_events") {
      RequestAPI.fetchUserChats().then((e) => {
        const info = e?.data
          ?.filter((el) => el?.chat?.type === "event")
          ?.map((e) => {
            return e?.chat;
          });

        setChats(info);
      });
    }
  }, [selected]);

  return (
    <View id="event" activePanel="event">
      <Panel id="event">
        <PanelHeader
          after={
            <>
              <PanelHeaderButton
                onClick={() => navigate("/event/create")}
                aria-label="addition">
                <Icon28AddOutline />
              </PanelHeaderButton>
              <PanelHeaderButton
                onClick={() => dispatch(changeActiveModal("filtration"))}
                aria-label="filtration">
                <Icon28SlidersOutline />
              </PanelHeaderButton>
              <PanelHeaderButton
                onClick={() => console.log("search")}
                aria-label="search">
                <Icon28SearchOutline />
              </PanelHeaderButton>
            </>
          }>
          <Title>События</Title>
        </PanelHeader>
        <Tabs mode={"default"}>
          <HorizontalScroll arrowSize="m">
            <TabsItem aria-controls="all-event">Все события</TabsItem>
            <TabsItem>Избранное</TabsItem>
            <TabsItem>Мои события</TabsItem>
          </HorizontalScroll>
        </Tabs>
        <Group id="all-event">
          <TabsHeader
            selected={selected}
            setSelected={(value) => setSelected(value)}
          />
          <Group>
            <div className="wrapper">
              {chats?.map((chat, i) => {
                return <EventCard {...chat} key={i} />;
              })}
            </div>
          </Group>
        </Group>
      </Panel>
    </View>
  );
};

export default Event;
