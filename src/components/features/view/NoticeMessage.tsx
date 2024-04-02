import { Anchor, Box, Flex, Stack } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { PluggableList } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface Props {
  message: string;
}

export default function NoticeMessage(props: Props) {
  return (
    <Flex justify="center">
      <Stack spacing={6} p={20} maw="80%" sx={{ flexGrow: 1 }}>
        <Box className="assistant-message" mr={10} style={{ flexGrow: 1 }}>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSanitize()] as PluggableList}
            remarkPlugins={[remarkGfm]}
            components={{
              a: (props) => {
                const { href, children } = props;
                return (
                  <Anchor
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={(theme) => ({
                      color: theme.colors["0"],
                    })}
                  >
                    {children}
                  </Anchor>
                );
              },
            }}
          >
            {props.message}
          </ReactMarkdown>
        </Box>
      </Stack>
    </Flex>
  );
}
