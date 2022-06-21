import { DailyRoomInfo } from "@daily-co/daily-js";
import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 *
 */

export interface DomainConfig {
  // Whether "Powered by Daily.co" displays in the in-call UI.
  // The default value depends on the plan that the domain is subscribed to.
  // You can only set this value if you are subscribed to a plan that allows
  // the branding to be hidden in the in-call UI.
  hideDailyBranding: boolean;

  // The default language for the video call UI, for all calls.
  // You can override this in a room's properties, or in a user's meeting token.
  // You can also set the language dynamically using the front-end library
  // setDailyLang() method.
  // Currently supported languages are en and fr.
  // You can also set this to user, which will use the browser's current language
  // setting (if it is English or French).
  lang: Language | null;

  // (For meetings that open in a separate browser tab.)
  // When a user clicks on the in-call menu bar's "leave meeting" button,
  // the browser loads this URL.
  // A query string that includes a parameter of the form recent_call=<domain>/<room>
  // is appended to the URL.
  // On mobile, you can redirect to a deep link to bring a user back into your app.
  redirectOnMeetingExit: string;
}

export interface UpdateRoomRequest {
  privacy?: Privacy;
  properties?: RoomConfig;
}

export interface CreateRoomRequest {
  name?: string;
  privacy?: Privacy;
  properties?: RoomConfig;
}
export interface CreateRoomResponse {
  id?: string;
  name?: string;
  api_created?: boolean;
  privacy?: Privacy;
  url?: string;
  created_at?: string;
  config?: RoomConfig;
}

export interface DeleteResponse {
  deleted: boolean;
  name: string;
}

export interface DomainResponse {
  domainName: string;
  config: DomainConfig;
}

export type Language = "en" | "fr" | "user";

export type MeetingTokenResponse = {
  token?: string;
};

export type MeetingTokenRequest = {
  properties: MeetingToken;
};

export type MeetingsRequest = {
  room?: string;
  timeframe_start?: number;
  timeframe_end?: number;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
};

export type MeetingsResponse = {
  id: string;
  room: string;
  start_time: number;
  duration: number;
  ongoing: boolean;
  max_participants: number;
  participants: Participant[];
};

export type Participant = {
  user_id: string | null;
  participant_id: string;
  user_name: string | null;
  join_time: number;
  duration: number;
};

export interface MeetingToken {
  // A unix timestamp (seconds since the epoch.)
  // The token is not valid until this time.
  nbf?: number;

  // A unix timestamp (seconds since the epoch.)
  // The token is not valid after this time.
  exp?: number;

  // The room for which this token is valid.
  // If room_name isn't set, the token is valid for all rooms in your domain.
  // *You should always set room_name if you are using this token to control access to a meeting.
  room_name?: string;

  // The user has meeting owner privileges.
  // For example, if the room is configured for owner_only_broadcast, this user can send video, and audio, and can screenshare.
  is_owner?: boolean;

  // The user's name in this meeting.
  // The name displays in the user interface when the user is muted or has turned off the camera, and in the chat window.
  // This username is also saved in the meeting events log (meeting events are retrievable using the analytics API methods.)
  user_name?: string;

  // The user's id for this meeting session.
  // This id is saved in the meeting events log (meeting events are retrievable using the analytics API methods).
  // You can use user_id to map between your user database and meeting events/attendance.
  // The id does not display in our standard in-call UI during the call.
  // If you do not set this, it will be set to the client's randomly generated session_id for this connection.
  user_id?: string;

  // The user is allowed to screenshare.
  enable_screenshare?: boolean;

  // The user joins with camera off.
  start_video_off?: boolean;

  // The user joins with mic muted.
  start_audio_off?: boolean;

  // The user is allowed to record.
  // The value of the field controls whether the recording is saved locally to disk, or is uploaded in real-time to the Daily.co cloud.
  // Allowed values are "cloud", and "local".
  enable_recording?: Recording;

  // Start cloud recording when the user joins the room.
  // This can be used to always record and archive meetings, for example in a customer support context.
  start_cloud_recording?: boolean;

  // (For meetings that open in a separate browser tab.)
  // When a user leaves a meeting using the button in the in-call menu bar, the browser tab closes.
  // This can be a good way, especially on mobile, for users to be returned to a previous website flow after a call.
  close_tab_on_exit?: boolean;

  // (For meetings that open in a separate browser tab.)
  // When a user leaves a meeting using the button in the in-call menu bar, the browser loads this URL.
  // A query string that includes a parameter of the form recent_call=<domain>/<room> is appended to the URL.
  // On mobile, you can redirect to a deep link to bring a user back into your app.
  redirect_on_meeting_exit?: string;

  // Kick this user out of the meeting at the time this meeting token expires.
  // If either this property or eject_after_elapsed are set for the token, the room's eject properties are overridden.
  eject_at_token_exp?: boolean;

  // Kick this user out of the meeting this many seconds after they join the meeting.
  // If either this property or eject_at_token_exp are set for the token, the room's eject properties are overridden.
  eject_after_elapsed?: boolean;

  // The language for the video call UI, for this user's session.
  // You can also set the language dynamically using the front-end library setDailyLang() method.
  // Currently supported languages are en and fr. You can also set this to user,
  // which will use the browser's current language setting (if it is English or French).
  lang?: Language;
}

export interface PaginatedRequest {
  limit?: number;
  ending_before?: string;
  starting_after?: string;
}

export interface PaginatedResponse<T> {
  total_count: number;
  data: T[];
}

export type Privacy = "public" | "private"; //| "org"

export type Recording = "cloud" | "local";

export interface Room {
  name: string;

  // Controls who joins a meeting
  privacy: Privacy;

  config: RoomConfig;
}

export type RoomConfig = DailyRoomInfo["config"];

export type LogsRequest = {
  //If true, you get a "logs" array in the results
  includeLogs?: boolean;

  //If true, results have "metrics" array
  includeMetrics?: boolean;

  //Filters by this user ID (aka "participant ID"). Required if mtgSessionId is not present in the request
  // Default: false
  userSessionId: string;

  //Filters by this Session ID. Required if userSessionId is not present in the request
  mtgSessionId: string;

  //Filters by the given log level name
  //Options: "ERROR","INFO","DEBUG"
  logLevel?: string;

  //ASC or DESC, case insensitive
  order?: "ASC" | "DESC";

  //A JS timestamp (ms since epoch in UTC)
  startTime?: number;

  // A JS timestamp (ms since epoch), defaults to the current time
  endTime?: number;

  // Limit the number of logs and/or metrics returned
  limit?: number;

  // Number of records to skip before returning results
  offset?: number;
};

type Log = any; //TODO
type Metric = any; //TODO

export type LogsResponse = {
  logs: Log[];
  logs_count: number;
  metrics: Metric[];
};

export class Daily {
  private token: string;
  private client: AxiosInstance;

  public constructor(token: string) {
    this.token = token;
    this.client = Axios.create({
      baseURL: "https://api.daily.co/v1",
      timeout: 15000,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  }

  // Get top-level configuration of your domain
  // https://docs.daily.co/reference#get-domain-configuration
  public async domainConfig(): Promise<DomainResponse> {
    return this.request({ method: "GET", url: "/" });
  }

  // Set top-level configuration options for your domain
  // https://docs.daily.co/reference#set-domain-configuration
  public async updateDomainConfig(data: DomainConfig): Promise<DomainConfig> {
    return this.request({ method: "POST", url: "/", data });
  }

  // List rooms
  // https://docs.daily.co/reference#list-rooms
  public async listRooms(
    params?: PaginatedRequest
  ): Promise<PaginatedResponse<RoomConfig>> {
    return this.request({ method: "GET", url: "/rooms", params });
  }

  // Create a room
  // https://docs.daily.co/reference#create-room
  public async createRoom(
    data: CreateRoomRequest
  ): Promise<CreateRoomResponse> {
    // console.log(data);
    return this.request({ method: "POST", url: "/rooms", data });
  }

  // Get info about a room
  // https://docs.daily.co/reference#get-room-configuration
  public async getRoom(name: string): Promise<CreateRoomResponse> {
    return this.request({ method: "GET", url: `/rooms/${name}` });
  }

  // Set a room's privacy and config properties
  // https://docs.daily.co/reference#set-room-configuration
  public async updateRoom(
    name: string,
    data: UpdateRoomRequest
  ): Promise<CreateRoomResponse> {
    return this.request({ method: "POST", url: `/rooms/${name}`, data });
  }

  // Delete room
  // https://docs.daily.co/reference#delete-room
  public async deleteRoom(name: string): Promise<DeleteResponse> {
    return this.request({ method: "DELETE", url: `/rooms/${name}` });
  }

  // returns a list of meeting sessions
  // https://docs.daily.co/reference/rest-api/meetings/get-meeting-information
  public async listMeetings(
    data?: MeetingsRequest
  ): Promise<PaginatedResponse<MeetingsResponse>> {
    return this.request({ method: "GET", url: "/meetings", data });
  }

  // Create a new meeting token.
  // https://docs.daily.co/reference#meeting-tokens
  public async createMeetingToken(
    data: MeetingTokenRequest
  ): Promise<MeetingTokenResponse> {
    return this.request({ method: "POST", url: "/meeting-tokens", data });
  }

  // https://docs.daily.co/reference#validate-meeting-token
  // Validate a meeting token
  public async meetingToken(token: string): Promise<object> {
    return this.request({ method: "GET", url: `/meeting-tokens/${token}` });
  }

  // https://docs.daily.co/reference/rest-api/logs/list-logs
  // List logs
  public async logs(params: LogsRequest): Promise<LogsResponse> {
    return this.request({ method: "GET", url: `/logs`, params });
  }

  private request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.client
      .request({
        ...config,
        // data: config.data ? snakeCase(config.data) : undefined,
        // params: config.params ? snakeCase(config.params) : undefined,
      })
      .then((res) => res.data);
    // .catch((res) => res.data);
  }
}
