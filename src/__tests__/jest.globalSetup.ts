import { EventBus } from "../models/EventBus";

export const globalSetup = () => {
};

export const globalTeardown = () => {
};

beforeEach(() => {
  EventBus.getInstance().clear();
});

afterEach(() => {
  EventBus.getInstance().clear();
});
