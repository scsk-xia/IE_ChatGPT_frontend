import { Center, Header, Image, Loader, Text } from "@mantine/core";
import { Thread } from "~/interfaces/thread";
import { Vectorstore } from "~/interfaces/vectorstore";

interface Props {
  vectorstoresLoading: boolean;
  selectedThread?: Thread;
  selectedVectorstore?: Vectorstore;
}

export const FormHeader = (props: Props) => {
  return (
    <Header height={45} top={56}>
      <Center
        p={10}
        sx={() => ({
          backgroundColor: "#F8F9FA",
          borderBottom: "1px solid #DEE2E6",
        })}
      >
        {props.vectorstoresLoading ? (
          <Loader />
        ) : (
          <>
            <Image src="/building.svg" alt="Vectorstore" width={24} height={24} style={{ marginRight: "20px" }} />
            <Text>{props.selectedVectorstore?.title}</Text>
          </>
        )}
      </Center>
    </Header>
  );
};
