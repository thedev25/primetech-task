import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

const item = {
  id: v4(),
  name: "Prime Tech",
};

const item2 = {
  id: v4(),
  name: "Task",
};

function App() {
  const [text, setText] = useState("");
  const [state, setState] = useState({
    todo: {
      title: "Todo",
      items: [item, item2],
    },
    "in-progress": {
      title: "In Progress",
      items: [item, item2],
    },
    done: {
      title: "Completed",
      items: [item, item2],
    },
  });

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };

      prev[source.droppableId].items.splice(source.index, 1);

      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  const addItem = () => {
    setState((prev) => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          items: [
            {
              id: v4(),
              name: text,
            },
            ...prev.todo.items,
          ],
        },
      };
    });

    setText("");
  };

  return (
    <div className="dnd">
      <div className="todo-add">
        <input
          placeholder="Please Add Your Task..."
          autocomplete="off"
          type="text"
          autocapitalize="none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="button" onClick={addItem}>
          Add
        </button>
      </div>
      <div className="container">
        <div className="todo-page">
          <DragDropContext onDragEnd={handleDragEnd}>
            {_.map(state, (data, key) => {
              return (
                <div key={key}>
                  <h3>{data.title}</h3>
                  <Droppable droppableId={key}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={"todo-card"}
                        >
                          {data.items.map((el, index) => {
                            return (
                              <Draggable
                                key={el.id}
                                index={index}
                                draggableId={el.id}
                              >
                                {(provided, snapshot) => {
                                  console.log(snapshot);
                                  return (
                                    <div
                                      className={`item ${
                                        snapshot.isDragging && "dragging"
                                      }`}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {el.name}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;
