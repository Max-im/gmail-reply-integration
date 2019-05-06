import {
  CONNECT_SHEET_DATA,
  CONNECT_GET_LABELS,
  CONNECT_GET_GMAIL_THREADS,
  CONNECT_GET_DB_THREADS,
  CONNECT_NEED_TO_CREATE,
  CONNECT_NEED_TO_UPDATE,
  CONNECT_NEED_TO_DELETE,
  CONNECT_GET_LABEL_MAP,
  CONNECT_GET_COMPRED,
  CONNECT_UPDATE
} from "../actions/constants";

export const connectState = {
  sheetData: [],
  dbLabels: [],
  gmailThreads: [],
  dbThreads: [],
  needToCreate: null,
  needToUpdate: null,
  needToDelete: null,
  labelMap: [],
  compared: []
};

export default (state = connectState, action) => {
  switch (action.type) {
    case CONNECT_SHEET_DATA:
      return { ...state, sheetData: action.payload };

    case CONNECT_GET_LABELS:
      return { ...state, dbLabels: action.payload };

    case CONNECT_GET_GMAIL_THREADS:
      return {
        ...state,
        gmailThreads: [...state.gmailThreads, ...action.payload]
      };

    case CONNECT_GET_DB_THREADS:
      return { ...state, dbThreads: action.payload };

    case CONNECT_NEED_TO_CREATE:
      return { ...state, needToCreate: action.payload };

    case CONNECT_NEED_TO_UPDATE:
      return { ...state, needToUpdate: action.payload };

    case CONNECT_NEED_TO_DELETE:
      return { ...state, needToDelete: action.payload };

    case CONNECT_GET_LABEL_MAP:
      return { ...state, labelMap: action.payload };

    case CONNECT_GET_COMPRED:
      return { ...state, compared: action.payload };

    case CONNECT_UPDATE:
      return { ...connectState };

    default:
      return state;
  }
};
