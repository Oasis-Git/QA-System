import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../../../types/user/Chat";
import Scrollbar from "../../general/Scrollbar";
import ChatMessageItem from "./ChatMessageItem";
import { findIndex } from "lodash";
import ImageLightbox from "./ImageLightbox";

interface ChatMessageListProps {
  avatar: string;
  username: string;
  messageList: ChatMessage[];
}

export default function ChatMessageList({
  avatar,
  username,
  messageList,
}: ChatMessageListProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [messageList]);

  const images = messageList
    .filter(message => message.messageType === "IMG")
    .map(message => message.content);

  const handleOpenLightbox = (url: string) => {
    const selected = findIndex(images, index => index === url);
    setSelectedImage(selected);
    setLightboxOpen(true);
  };

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{ ref: scrollRef }}
        sx={{ p: 3, height: 1 }}
      >
        {messageList.map((message, idx) => (
          <ChatMessageItem
            message={message}
            key={idx}
            avatar={avatar}
            username={username}
            handleOpenLightbox={handleOpenLightbox}
          />
        ))}
      </Scrollbar>

      <ImageLightbox
        images={images}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
