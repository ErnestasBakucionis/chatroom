import React, { Suspense } from "react";
import WebsiteInfo from "@/components/WebsiteInfo";
import ChatBox from "@/components/ChatBox";
import Loading from "@/components/LoadingBox";

const RoomPage: React.FC = () => {
  return (
    <>
      <WebsiteInfo />
      <Suspense fallback={<Loading />}>
        <ChatBox />
      </Suspense>
    </>
  );
};

export default RoomPage;
