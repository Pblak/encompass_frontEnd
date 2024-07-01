<template>
  <div>
    <v-card>
      <v-card-title>Event</v-card-title>
      <v-card-text>
        <v-text-field label="Event Name" v-model="eventName" outlined></v-text-field>
        <v-text-field label="Event Date" v-model="eventDate" outlined></v-text-field>
        <v-text-field label="Event Time" v-model="eventTime" outlined></v-text-field>
        <v-text-field label="Event Location" v-model="eventLocation" outlined></v-text-field>
        <v-text-field label="Event Description" v-model="eventDescription" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="createEvent(eventName, eventDate, eventTime, eventLocation, eventDescription)">Create Event</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import {useEvent} from "@/api/useEvent";
</script>
