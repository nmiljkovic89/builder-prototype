import { Dispatch, SetStateAction, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Rnd } from "react-rnd";
import { useContextMenu } from "react-contexify";
import { useOuterClick } from "../hooks";
import Image from "next/image";

import testImg from "../public/test.jpg";

interface ButtonProps {
  width: string | number;
  height: string | number;
  x: number;
  y: number;
  type: string;
  id: number;
  zIndex: number;
  zoom: number;
  setElements: Dispatch<
    SetStateAction<
      {
        id: number;
        type: string;
        width: string;
        height: string;
        x: number;
        y: number;
      }[]
    >
  >;
}

export function BrameImage({
  id,
  setElements,
  width,
  height,
  zIndex,
  zoom,
  x,
  y,
}: ButtonProps) {
  const { show } = useContextMenu({
    id: "element",
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const ref = useOuterClick<HTMLDivElement>(() => {
    setIsSelected(false);
  });
  return (
    <Rnd
      style={{ zIndex }}
      size={{ width, height }}
      position={{ x: x, y: y }}
      scale={zoom}
      bounds="[data-canvas]"
      lockAspectRatio
      onMouseDown={() => {
        setIsSelected(true);
      }}
      onDrag={(e, d) => {
        setElements((state) =>
          state.map((el) => {
            if (el.id === id) {
              return {
                ...el,
                x: d.x,
                y: d.y,
              };
            }
            return el;
          })
        );
      }}
      onResizeStart={() => {
        setIsResizing(true);
      }}
      onResize={(e, direction, ref, delta, position) => {
        setElements((state) =>
          state.map((el) => {
            if (el.id === id) {
              return {
                ...el,
                width: ref.style.width,
                height: ref.style.height,
                ...position,
              };
            }
            return el;
          })
        );
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
      }}
    >
      {isResizing && (
        <Box
          position="absolute"
          bottom="-20px"
          left="50%"
          transform="translateX(-50%)"
          width="100%"
          bgColor="green.200"
          borderRadius="5px"
          textAlign="center"
        >
          <Text fontSize="10px">
            {width} x {height}
          </Text>
        </Box>
      )}

      <Box
        position="relative"
        ref={ref}
        bg={`url(${testImg.src})`}
        w="100%"
        height="100%"
        backgroundSize="cover"
        onContextMenu={(e) => {
          show({
            event: e,
          });
        }}
      >
        {isSelected ? (
          <Box
            position="absolute"
            top={0}
            w="100%"
            height="100%"
            border="3px dashed"
            borderColor="blue.300"
          />
        ) : null}
      </Box>
    </Rnd>
  );
}
