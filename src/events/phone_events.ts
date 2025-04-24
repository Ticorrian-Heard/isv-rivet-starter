import { phoneS2SOAuthClient, db } from '../modules.ts';

let phoneEvents: any[] = [
         "phone.recording_deleted",
         "phone.caller_call_log_completed",
         "phone.recording_completed_for_access_member",
         "phone.recording_resumed",
         "phone.recording_transcript_completed",
         "phone.call_log_permanently_deleted",
         "phone.transfer_call_to_voicemail_initiated",
         "phone.callee_missed",
         "phone.caller_ringing",
         "phone.voicemail_received",
         "phone.sms_sent",
         "phone.voicemail_deleted",
         "phone.voicemail_transcript_completed",
         "phone.recording_permanently_deleted",
         "phone.peering_number_emergency_address_updated",
         "phone.sms_campaign_number_opt_out",
         "phone.caller_ended",
         "phone.callee_ended",
         "phone.callee_call_history_completed",
         "phone.voicemail_permanently_deleted",
         "phone.sms_campaign_number_opt_in",
         "phone.callee_mute",
         "phone.call_history_deleted",
         "phone.call_log_deleted",
         "phone.caller_hold",
         "phone.caller_connected",
         "phone.recording_completed",
         "phone.recording_started",
         "phone.sms_sent_failed",
         "phone.callee_call_log_completed",
         "phone.callee_ringing",
         "phone.caller_unhold",
         "phone.callee_hold",
         "phone.callee_answered",
         "phone.caller_unmute",
         "phone.device_registration",
         "phone.blind_transfer_initiated",
         "phone.account_settings_updated",
         "phone.callee_meeting_inviting",
         "phone.callee_parked",
         "phone.emergency_alert",
         "phone.callee_rejected",
         "phone.group_settings_updated",
         "phone.callee_unmute",
         "phone.recording_stopped",
         "phone.caller_meeting_inviting",
         "phone.voicemail_received_for_access_member",
         "phone.callee_unhold",
         "phone.conference_started",
         "phone.generic_device_provision",
         "phone.recording_paused",
         "phone.sms_received",
         "phone.recording_failed",
         "phone.caller_call_history_completed",
         "phone.peering_number_cnam_updated",
         "phone.caller_mute",
]

let findNestedKey = (obj: any, key: string): string  => {
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }
  
    for (const prop in obj) {
      if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        let val = findNestedKey(obj[prop], key);
        if (val) {
          return val;
        } 
      }
    }
    return "";
}

export const startPhoneEvents = () => {
    const eventHandler = ({ event, payload }: any)=>{
        console.dir({ [event]: payload}, { depth: null });

        let eventCallId = findNestedKey(payload, "call_id");

        db.update(({ logs }) => {
            let callId = logs.find((obj) => obj.callId === eventCallId); 
            if (callId) callId.callLogs?.push({ [event]: payload });
            else {
                logs.push({callId: eventCallId, callLogs: [{[event]: payload }] });
            }
        });

    }

    phoneEvents.forEach(event => {
        phoneS2SOAuthClient.webEventConsumer.event(event, eventHandler);
    });
}