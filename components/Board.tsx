import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  initializeBoard,
  BoardType,
  moveTiles,
  addRandomTile,
  isGameOver,
} from "../utils/gameLogic";

const isWeb = Platform.OS === "web";
const screenWidth = isWeb
  ? Math.min(500, Dimensions.get("window").width)
  : Dimensions.get("window").width;
const BOARD_SIZE = 4;
const BOARD_PADDING = screenWidth * 0.03;
const CELL_SIZE =
  (screenWidth - BOARD_PADDING * 2) / BOARD_SIZE - BOARD_PADDING;
const CELL_MARGIN = screenWidth * 0.01;

export default function Board() {
  const [board, setBoard] = useState<BoardType>(initializeBoard());
  const [showAlert, setShowAlert] = useState<boolean>(false);

  function resetGame() {
    setBoard(initializeBoard());
  }

  const handleMove = (direction: "up" | "down" | "left" | "right") => {
    setBoard((prevBoard) => {
      const hydratedBoard = moveTiles(prevBoard, direction);
      const newBoard = addRandomTile(hydratedBoard);

      if (isGameOver(newBoard)) {
        setShowAlert(true);
      }

      return newBoard;
    });
  };

  const onGestureEvent = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    const minDistance = 25;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > minDistance) {
        handleMove("right");
      } else if (translationX < -minDistance) {
        handleMove("left");
      }
    } else {
      if (translationY > minDistance) {
        handleMove("down");
      } else if (translationY < -minDistance) {
        handleMove("up");
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          handleMove("up");
          break;
        case "ArrowDown":
          handleMove("down");
          break;
        case "ArrowLeft":
          handleMove("left");
          break;
        case "ArrowRight":
          handleMove("right");
          break;
      }
    };

    if (Platform.OS === "web") {
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  const getTileStyle = (
    value: number
  ): { backgroundColor: string; color: string } => {
    const tileStyles: { [key: number]: object } = {
      0: { backgroundColor: "#cdc1b4", color: "#776e65" }, // Style for empty tiles
      2: { backgroundColor: "#eee4da", color: "#776e65" },
      4: { backgroundColor: "#eee1c9", color: "#776e65" },
      8: { backgroundColor: "#f3b27a", color: "#f9f6f2" },
      16: { backgroundColor: "#f69664", color: "#f9f6f2" },
      32: { backgroundColor: "#f77c5f", color: "#f9f6f2" },
      64: { backgroundColor: "#f75f3b", color: "#f9f6f2" },
      128: { backgroundColor: "#edd073", color: "#f9f6f2" },
      256: { backgroundColor: "#edcc62", color: "#f9f6f2" },
      512: { backgroundColor: "#edc950", color: "#f9f6f2" },
      1024: { backgroundColor: "#edc53f", color: "#f9f6f2" },
      2048: { backgroundColor: "#edc22e", color: "#f9f6f2" },
    };
    return (
      (tileStyles[value] as { backgroundColor: string; color: string }) || {
        backgroundColor: "#3c3a33",
        color: "#f9f6f2",
      }
    );
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <PanGestureHandler
          onHandlerStateChange={(event) => {
            if (event.nativeEvent.state === State.END) {
              onGestureEvent(event);
            }
          }}
        >
          <View style={styles.board}>
            {board.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((tile, colIndex) => (
                  <View
                    key={colIndex}
                    style={[
                      styles.tile,
                      {
                        left:
                          colIndex * (CELL_SIZE + CELL_MARGIN * 2) +
                          BOARD_PADDING,
                        top:
                          rowIndex * (CELL_SIZE + CELL_MARGIN * 2) +
                          BOARD_PADDING,
                      },
                      getTileStyle(tile), // Apply style for all tiles, including empty ones
                    ]}
                  >
                    <Text
                      style={[
                        styles.tileText,
                        { color: getTileStyle(tile).color },
                      ]}
                    >
                      {tile !== 0 ? tile : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Game Over"
        message="No more moves available!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="New Game"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          resetGame();

          setShowAlert(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf8ef",
  },
  gestureContainer: {
    width: screenWidth,
    height: screenWidth,
  },
  board: {
    backgroundColor: "#bbada0",
    padding: BOARD_PADDING,
    borderRadius: 6,
    width: screenWidth,
    height: screenWidth,
  },
  row: {
    flexDirection: "row",
  },
  tile: {
    position: "absolute",
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  tileText: {
    fontSize: CELL_SIZE * 0.35,
    fontWeight: "bold",
  },
  // Remove the generated tile positions
});
