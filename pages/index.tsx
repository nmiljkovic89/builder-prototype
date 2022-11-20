import {
  Box,
  Button,
  Select,
  Text as ChakraText,
  Icon,
} from "@chakra-ui/react";
import NonSSRWrapper from "../components/NoSSRWrapper";
import React, { useRef, useState } from "react";
import { BrameButton } from "../components/Button";
import Split from "react-split";
import { useDrag, useDrop } from "react-dnd";
import { TextMenu } from "../components/TextMenu";
import { BrameImage } from "../components/Image";
import { SearchIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { MdPanTool } from "react-icons/md";

export default function Home() {
  const [elements, setElements] = useState([]);
  const [zoom, setZoom] = useState(1);
  const initialPanPosition = useRef({ x: 0, y: 0 });
  const [enablePan, setEnablePan] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [canvasPos, setCanvasPos] = useState({ x: 0, y: 0 });

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: "Button",
    item: {
      type: "BUTTON",
    },
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isDragging: isDraggingImage }, dragImage, dragPreviewImage] =
    useDrag(() => ({
      // "type" is required. It is used by the "accept" specification of drop targets.
      type: "Image",
      item: {
        type: "IMAGE",
      },
      // The collect function utilizes a "monitor" instance (see the Overview for what this is)
      // to pull important pieces of state from the DnD system.
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: ["Button", "Image"],
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item, monitor) {
      setElements((elements) => {
        if (item.type === "BUTTON") {
          return [
            ...elements,
            {
              id: elements.length + 1,
              type: "BUTTON",
              width: "100px",
              height: "50px",
              x: 100,
              y: 100,
              zIndex: elements.length + 1,
            },
          ];
        }
        if (item.type === "IMAGE") {
          return [
            ...elements,
            {
              id: elements.length + 1,
              type: "IMAGE",
              width: "200px",
              height: "150px",
              x: 0,
              y: 0,
              zIndex: 1,
            },
          ];
        }

        return elements;
      });
      return item;
    },
  }));

  return (
    <NonSSRWrapper>
      <Box
        position="fixed"
        w="30%"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        bg="#111111"
        p={2}
        borderRadius="md"
        zIndex={999}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <IconButton
          onClick={() => {
            setEnablePan((s) => !s);
          }}
          background="transparent"
          _hover={{
            background: "transparent",
          }}
          aria-label="pan"
          mr={2}
          icon={<Icon as={MdPanTool} fontSize="15px" color="#fff" />}
        />
        <Select
          icon={<Icon as={SearchIcon} fontSize="15px" color="#fff" />}
          w="80px"
          value={String(zoom)}
          size="sm"
          color="#fff"
          placeholder="Zoom"
          onChange={(e) => {
            setZoom(Number(e.target.value));
          }}
        >
          <option value="2">200%</option>
          <option value="1">100%</option>
          <option value="0.8">80%</option>
        </Select>
      </Box>
      <Split
        direction="horizontal"
        sizes={[20, 60, 20]}
        style={{
          cursor: isPanning ? "grab" : "default",
          width: `100%`,
          display: "flex",
          height: "100vh",
          background: "#333333",
          overflowY: "hidden",
        }}
      >
        <Box
          padding="20px"
          background="#111111"
          display="flex"
          flexDir="column"
          position="relative"
          zIndex={99}
        >
          <ChakraText textAlign="center" mb={4} color="#fff" fontSize="12px">
            Components
          </ChakraText>
          <Box
            mb={4}
            ref={dragPreview}
            style={{
              opacity: isDragging ? 0.5 : 1,
            }}
            display="flex"
            borderRadius="0.375rem"
            transform="translate(0, 0)"
          >
            <Button size="sm" role="Handle" width="100%" ref={drag}>
              Button
            </Button>
          </Box>

          <Box
            ref={dragPreviewImage}
            style={{
              opacity: isDraggingImage ? 0.5 : 1,
            }}
            display="flex"
            borderRadius="0.375rem"
            transform="translate(0, 0)"
          >
            <Button size="sm" role="Handle" width="100%" ref={dragImage}>
              Image
            </Button>
          </Box>
        </Box>

        <Box
          background={isOver ? "rgba(44,44,44,0.1)" : "transparent"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          willChange="transform"
          onMouseDown={(e) => {
            if (enablePan) {
              initialPanPosition.current = {
                x: e.screenX,
                y: e.screenY,
              };
              setIsPanning(true);
            }
          }}
          onMouseMove={(e) => {
            if (enablePan && isPanning) {
              setCanvasPos((state) => {
                return {
                  x: e.screenX - initialPanPosition.current.x,
                  y: e.screenY - initialPanPosition.current.y,
                };
              });
            }
          }}
          onMouseUp={() => {
            if (enablePan) {
              setIsPanning(false);
            }
          }}
          transform={`translate(${canvasPos.x}px,${canvasPos.y}px)`}
        >
          <Box transform={`scale(${zoom})`}>
            <Box
              w={375}
              height={667}
              data-canvas
              role="canvas"
              position="relative"
              boxShadow="lg"
              bg="#fff"
              ref={drop}
            >
              {elements.map((el) => {
                if (el.type === "BUTTON")
                  return (
                    <BrameButton
                      {...el}
                      key={el.id}
                      setElements={setElements}
                      zoom={zoom}
                    />
                  );
                if (el.type === "IMAGE")
                  return (
                    <BrameImage
                      {...el}
                      key={el.id}
                      setElements={setElements}
                      zoom={zoom}
                    />
                  );
                return null;
              })}
            </Box>
          </Box>
        </Box>

        <Box position="relative" background="#111111" zIndex={99}></Box>
      </Split>
      <TextMenu id="element" />
    </NonSSRWrapper>
  );
}
