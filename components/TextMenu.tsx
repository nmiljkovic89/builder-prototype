import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

interface TextMenuProps {
  id: string;
}

export function TextMenu({ id }: TextMenuProps) {
  return (
    <Menu id={id} style={{ fontSize: "12px" }}>
      <Item>Item 1</Item>
      <Item>Item 2</Item>
      <Separator />
      <Item disabled>Disabled</Item>
      <Separator />
      <Submenu label="Submenu">
        <Item>Sub Item 1</Item>
        <Item>Sub Item 2</Item>
      </Submenu>
    </Menu>
  );
}
