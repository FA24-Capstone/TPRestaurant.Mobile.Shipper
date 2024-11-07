export interface AppActionResult<T = any> {
  result: T;
  isSuccess: boolean;
  messages: string[];
}
