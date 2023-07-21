import React from "react";
import "./ChatItem.scss";
import { Cell, Avatar, Headline } from "@vkontakte/vkui";
import { Link } from "react-router-dom";

const SubtitleGroup = ({ lastMessage, subChats }) => {
  const subChatsFormated = subChats ? subChats.join(", ") : "";

  return (
    <>
      {Boolean(subChats) && (
        <Headline level="1" className="subchats">
          {subChatsFormated}
        </Headline>
      )}
      <Headline level="1" className="last-message">
        <span className="username">{lastMessage?.user.username}</span>: {lastMessage?.text}
      </Headline>
    </>
  );
};

const SubtitlePM = ({ lastMessage }) => (
  <Headline level="1" className="last-message">
    {lastMessage.text}
  </Headline>
);

const ChatItem = ({ id, name, img, isGroup, lastMessage, subChats }) => {
  const url = subChats?.length ? `/messenger/subchats/${id}` : `/messenger/${id}`;

  return (
    <Link to={url} key={id}>
      <Cell
        className={`chat-item ${isGroup ? "group-item" : ""} ${subChats ? "with-subchats" : ""}`}
        before={<Avatar size={56} src={img} className="avatar" />}
        subtitle={
          isGroup ? (
            <SubtitleGroup lastMessage={lastMessage} subChats={subChats} />
          ) : (
            <SubtitlePM lastMessage={lastMessage} />
          )
        }
        indicator={
          <Headline level="1" className="time-message">
            17:58
          </Headline>
        }>
        <Headline level="1" className="name-chat">
          {name}
        </Headline>
      </Cell>
    </Link>
  );
};

export default ChatItem;