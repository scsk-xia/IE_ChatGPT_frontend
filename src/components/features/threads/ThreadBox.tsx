import { ActionIcon, Group, Image, NavLink } from "@mantine/core";

interface Props {
  title: string;
  selected: boolean;
  disabled: boolean;
  onClick: any;
  onEdit: any;
  onDelete: any;
}

interface SubProps {
  onEdit: any;
  onDelete: any;
}

function ThreadActionButtons(props: SubProps) {
  return (
    <Group spacing="xs">
      <ActionIcon
        sx={(theme) => ({
          width: "25px",
          height: "25px",
          padding: "0.5px",
          border: "none",
          minHeight: "unset",
          minWidth: "unset",
          "&:hover": { backgroundColor: theme.colors["5"] },
        })}
      >
        <Image src="/pen.svg" alt="Edit" width={24} height={24} onClick={props.onEdit} />
      </ActionIcon>
      <ActionIcon
        sx={(theme) => ({
          width: "25px",
          height: "25px",
          padding: "0.5px",
          border: "none",
          minHeight: "unset",
          minWidth: "unset",
          "&:hover": { backgroundColor: theme.colors["5"] },
        })}
      >
        <Image src="/trash.svg" alt="Delete" width={24} height={24} onClick={props.onDelete} />
      </ActionIcon>
    </Group>
  );
}

export default function ThreadBox(props: Props) {
  return (
    <NavLink
      disabled={props.disabled}
      component="div"
      label={props.title}
      icon={<Image src="/titlebubble.svg" alt="Thread" width={24} height={24} />}
      noWrap
      onClick={props.onClick}
      rightSection={props.selected && <ThreadActionButtons onEdit={props.onEdit} onDelete={props.onDelete} />}
      color="gray"
      variant="filled"
      styles={(theme) => ({
        root: {
          color: "#F8F9FA",
          backgroundColor: props.selected ? theme.colors["4"] : theme.colors["5"],
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: theme.colors["4"],
          },
        },
      })}
    />
  );
}
