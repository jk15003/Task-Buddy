"use client";

import { updateCardOrder } from "@/actions/update-card-order";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import {
    DragDropContext,
    Droppable,
    DropResult
} from "@hello-pangea/dnd";
import { toast } from "sonner";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const ListContainer = ({
    data,
    boardId,
}: ListContainerProps) => {
    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered!");
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Cards reordered!");
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const [orderedData, setOrderedData] = useState(data);

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        //if dropped in the same position
        if (
            destination.droppableId === source.droppableId
            && destination.index === source.index
        ) {
            return;
        }

        //user moving list
        if (type === 'list') {
            const items = reorder(
                orderedData,
                source.index,
                destination.index,
            ).map((item, index) => ({ ...item, order: index }));

            setOrderedData(items);
            //server action to save
            executeUpdateListOrder({ items, boardId });
        }

        if (type === "card") {
            const newOrderedData = [...orderedData];

            // Source and destination list
            const sourceList = newOrderedData.find(
                (list) => list.id === source.droppableId
            );
            const destList = newOrderedData.find(
                (list) => list.id === destination.droppableId
            );

            if (!sourceList || !destList) {
                return;
            }
            //check if cards exist on the source list
            if (!sourceList.cards) {
                sourceList.cards = [];
            }
            //check if cards exist on the destList
            if (!destList.cards) {
                destList.cards = [];
            }
            //moving the cards to te same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index,
                );

                reorderedCards.forEach((card, idx) => {
                    card.order = idx;
                });

                sourceList.cards = reorderedCards;

                setOrderedData(newOrderedData);
                //server action trigger
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: reorderedCards,
                });

                //user moves a card to another list
            } else {
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                //assign new list id to the moved card
                movedCard.listId = destination.droppableId;
                //add card to the destination list
                destList.cards.splice(destination.index, 0, movedCard);
                sourceList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                //update order for each card in the dest list
                destList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                setOrderedData(newOrderedData);
                //server action
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destList.cards,
                })
            }
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData.map((list, index) => {
                            return (
                                <ListItem
                                    key={list.id}
                                    index={index}
                                    data={list}
                                />
                            );
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
}