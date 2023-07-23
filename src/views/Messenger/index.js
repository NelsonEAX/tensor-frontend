import React from "react";
import { View, Panel } from "@vkontakte/vkui";
import { useLocation, matchRoutes } from "react-router-dom";
import Chat from "./Chat";
import ListChats from "./ListChats";
import CreateChat from "./CreateChat";
import { DESTINY_CHAT } from "./../../const/chat";

const panels = [
  {
    id: "subChats",
    path: "/messenger/subchats/:id",
    element: <Chat destiny={DESTINY_CHAT.subChats} />,
  },
  {
    id: "chat",
    path: "/messenger/chat/:id",
    element: <Chat destiny={DESTINY_CHAT.messages} />,
  },
  {
    id: "descriptionChat",
    path: "/messenger/description/:id",
    element: <Chat destiny={DESTINY_CHAT.description} />,
  },
  { id: "createChat", path: "/messenger/create_chat", element: <CreateChat /> },
  { id: "listChats", path: "/messenger", element: <ListChats /> },
];

const routes = panels.map(({ path }) => ({ path }));

// компонент необходим для плавной анимации

const Messenger = () => {
  const location = useLocation();

  const [{ route }] = matchRoutes(routes, location);
  const activePanel = panels.find((panel) => panel.path == route.path)?.id;

  return (
    <>
      <View id="messenger" activePanel={activePanel}>
        {panels.map(({ id, element }) => (
          <Panel key={id} id={id}>
            {element}
          </Panel>
        ))}
      </View>
    </>
  );
};

export default Messenger;
