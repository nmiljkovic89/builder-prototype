import { Box, Button, Text as ChakraText } from "@chakra-ui/react";
import { Text, Stage } from "@inlet/react-pixi";
import {
  TextStyle,
  InteractionEvent,
  InteractionData,
  DisplayObject,
} from "pixi.js";
import NonSSRWrapper from "../components/NoSSRWrapper";
import Split from "react-split";
import { useDrag, useDrop } from "react-dnd";

interface PixiDraggable extends DisplayObject {
  data: InteractionData | null;
  dragging: boolean;
}

const Draggable = ({ image, x, y }: any) => {
  const onDragStart = (event: InteractionEvent) => {
    const sprite = event.currentTarget as PixiDraggable;
    // const viewport = sprite.parent;

    sprite.alpha = 0.5;
    sprite.data = event.data;
    sprite.dragging = true;
    // viewport.drag({ pressDrag: false });
  };

  const onDragEnd = (event: InteractionEvent) => {
    const sprite = event.currentTarget as PixiDraggable;
    // const viewport = sprite.parent as PixiViewport;

    sprite.alpha = 1;
    sprite.dragging = false;
    sprite.data = null;
    // viewport.drag();
  };

  const onDragMove = (event: InteractionEvent) => {
    const sprite = event.currentTarget as PixiDraggable;
    if (sprite.dragging) {
      const newPosition = sprite.data!.getLocalPosition(sprite.parent);
      sprite.x = newPosition.x;
      sprite.y = newPosition.y;
    }
  };

  return (
    <Text
      text="Hello World"
      anchor={0.5}
      pointerdown={onDragStart}
      pointerup={onDragEnd}
      pointerupoutside={onDragEnd}
      pointermove={onDragMove}
      interactive
      x={x || 200}
      y={y || 200}
      style={
        new TextStyle({
          align: "center",
          fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
          fontSize: 50,
          fontWeight: "400",
          fill: ["#ffffff", "#00ff99"], // gradient
          stroke: "#01d27e",
          strokeThickness: 5,
          letterSpacing: 20,
          dropShadow: true,
          dropShadowColor: "#ccced2",
          dropShadowBlur: 4,
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 6,
          wordWrap: true,
          wordWrapWidth: 440,
        })
      }
    />
  );
};

export default function Home() {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: "Button",
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: "Button",
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  console.log("-> isOver", isOver);
  console.log("-> isDragging", isDragging);

  return (
    <NonSSRWrapper>
      <Split
        direction="horizontal"
        style={{ width: `100%`, display: "flex", height: "100vh" }}
      >
        <Box
          padding="20px"
          background="#2c2c2c"
          display="flex"
          flexDir="column"
        >
          <ChakraText textAlign="center" mb={4} color="#fff">
            Components
          </ChakraText>
          <Box
            ref={dragPreview}
            style={{
              opacity: isDragging ? 0.5 : 1,
            }}
            display="flex"
            borderRadius="0.375rem"
            transform="translate(0, 0)"
          >
            <Button role="Handle" ref={drag} width="100%">
              Button
            </Button>
          </Box>
        </Box>
        <Box
          role="canvas"
          ref={drop}
          style={{ background: isOver ? "rgba(44,44,44,0.1)" : "#fff" }}
        >
          <Stage
            width={
              typeof window !== "undefined" ? window.innerWidth / 2 : undefined
            }
            options={{ backgroundAlpha: 0 }}
          >
            <Draggable />
          </Stage>
        </Box>
        <Box background="#2c2c2c">test</Box>
      </Split>
    </NonSSRWrapper>
  );
}
