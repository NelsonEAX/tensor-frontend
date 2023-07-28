import { useState, useEffect } from "react";
import {
  Group,
  List,
  Tabs,
  TabsItem,
  FixedLayout,
  Search,
  PanelSpinner,
} from "@vkontakte/vkui";
import "./index.scss";
import MyChatItem from "./MyChatItem";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../../store/reducers/chatSlice";
import {
  activeTabChatSelector,
  chatsSelector,
  isLoadedChatsSelector,
} from "../../../store/selectors/chatSelectors";
import { fetchChats } from "./../../../store/reducers/chatSlice";
import {
  addBounceEffect,
  removeBounceEffect,
} from "./../../../utils/bounceEffect";
import cn from "classnames";
import PanelHeader from "./PanelHeader";
import ListSubChats from "./ListSubChats";
import ReccomendChatItem from "./ReccomendChatItem";

const tabs = [
  {
    id: "my_chats",
    text: "Мои чаты",
  },
  {
    id: "others_chats",
    text: "Рекомендации",
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

const ListChats = () => {
  const dispatch = useDispatch();

  const chats = useSelector(chatsSelector);
  const selected = useSelector(activeTabChatSelector);
  const isLoaded = useSelector(isLoadedChatsSelector);
  const [search, setSearch] = useState({ isActive: false, text: "" });
  const [selectedChat, setSelectedChat] = useState();

  useEffect(() => {
    dispatch(fetchChats());
  }, [selected]);

  useEffect(() => {
    removeBounceEffect();

    return () => addBounceEffect();
  }, []);

  const showSubchats = () => {
    setSelectedChat(chats[1]);
  };

  // TO DO: Сделать анимацию загрузки чатов

  const ListMyChats = ({ ...props }) =>
    sortChats(chats)
      .filter((chat) => chat?.chat?.id)
      .map(({ chat, last_message, user, date }, i) => {
        return (
          <MyChatItem
            {...props}
            isSelected={selectedChat?.id == chat?.id}
            key={chat?.id}
            lastMessage={last_message}
            user={user}
            date={date}
            {...chat}
          />
        );
      });

  const sortChats = (chats) => {
    const searchText = search.text.toLowerCase();

    return chats.filter((item) => {
      const chat = item?.chat || item;

      if (chat?.type == "group" || chat?.type == "event") {
        return chat?.external?.title?.toLowerCase().includes(searchText);
      } else if (chat?.email) {
        const name = `${chat?.external?.firstName} ${chat?.external?.lastName}`;
        return name.toLowerCase().includes(searchText);
      }

      return true;
    });
  };

  const ListReccomendChats = ({ ...props }) => {
    return sortChats(chats)
      .filter((chat) => chat?.chat?.id)
      .map(({ chat }, i) => {
        return <ReccomendChatItem {...props} key={chat?.id} {...chat} />;
      });
  };

  return (
    <div
      className={cn("list-chats-container", {
        "search-active": search.isActive,
        "shown-subchats": Boolean(selectedChat),
      })}>
      <PanelHeader
        isShownSubchats={Boolean(selectedChat)}
        hideSubChats={() => setSelectedChat(null)}
        showSubChats={showSubchats}
        title={selectedChat?.chat?.external?.title || "Тестовое название"}
        avatar={selectedChat?.chat?.external?.avatar}
        isSearchActive={search.isActive}
        setSearch={setSearch}
      />
      {!selectedChat && (
        <FixedLayout vertical="top" className="fixed-layout">
          <TabsHeader
            selected={selected}
            setSelected={(value) => {
              isLoaded && dispatch(setActiveTab(value));
            }}
          />
          <Search
            className="fixed-layout__search"
            value={search.text}
            onChange={(e) => setSearch((s) => ({ ...s, text: e.target.value }))}
            after={null}
          />
        </FixedLayout>
      )}
      <Group separator="hide" className="group-list-chats">
        <List className="list-chats">
          {isLoaded ? (
            selected == "my_chats" ? (
              <ListMyChats />
            ) : (
              <ListReccomendChats />
            )
          ) : (
            <PanelSpinner style={{ height: "80vh" }} size="large" />
          )}
        </List>
      </Group>
      {/* <ListSubChats>
        {isLoaded ? (
          selected == "my_chats" ? (
            <ListMyChats hideAvatar={true} />
          ) : (
            <ListReccomendChats hideAvatar={true} />
          )
        ) : (
          <PanelSpinner style={{ height: "80vh" }} size="large" />
        )}
      </ListSubChats> */}
    </div>
  );
};

export default ListChats;
