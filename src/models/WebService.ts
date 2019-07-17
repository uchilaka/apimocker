import { Request } from 'express';

export enum HttpRequestVerb {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  DELETE = 'delete',
}

export interface ResponseConfig {
  httpStatus: number;
  contentType?: string;
  mockFile?: string;
}

export interface TemplateSwitchConfig {
  key: string;
  switch: string;
  type?: string;
}

export interface GenericWebService {
  verbs: (HttpRequestVerb | 'all')[];
  mockFile: string;
  contentType?: string;
  mockBody?: string;
  bodies?: {
    [verb: string]: any[];
  };
  responses?: {
    [verb: string]: ResponseConfig;
  };
  switch?: string;
  switchResponses?: {
    [verb: string]: ResponseConfig;
  };
}

export interface TemplateWebService extends GenericWebService {
  enableTemplate?: boolean;
}

export interface TemplateSwitchWebService extends GenericWebService {
  templateSwitch: TemplateSwitchConfig[] | string[];
}

export type AnyWebService =
  | GenericWebService
  | TemplateWebService
  | TemplateSwitchWebService;
