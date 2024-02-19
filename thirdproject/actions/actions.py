# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions
# rasa run actions -v
from typing import Any, Text, Dict, List
import random
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionRoomType(Action):

    def name(self) -> Text:
        return "action_select_room_type"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        room_types = ["kamar tunggal", "kamar ganda", "kamar suite", "kamar keluarga"]

        chosen_room_type = random.choice(room_types)

        dispatcher.utter_message(text=f"Saya ingin {chosen_room_type}")

        return [SlotSet("chosen_room_type", chosen_room_type)]
