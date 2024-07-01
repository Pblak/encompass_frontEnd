<template>
  <div>
    <v-card>
      <v-card-title>Message</v-card-title>
      <v-card-text>
        <v-text-field label="Message Title" v-model="messageTitle" outlined></v-text-field>
        <v-text-field label="Message Content" v-model="messageContent" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="createMessage(messageTitle, messageContent)">Create Message</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import {useMessage} from "@/api/useMessage";
</script>
