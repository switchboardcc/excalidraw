# Switchboard on Excalidraw

## Overview

This repository showcases what creating a growth experience with Switchboard looks like. For this demo, we'll be building an onboarding experience on top of [Excalidraw](https://github.com/excalidraw/excalidraw), an open source tool for drawing and diagramming. We've also pulled in some basic UI components from [Chakra UI](https://chakra-ui.com/), an open source React component library.

## Requirements

- [Node.js](https://nodejs.org/) (v14 or v16)
- [Yarn](https://yarnpkg.com/getting-started/install) or [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Git](https://git-scm.com/downloads)

## Getting started

Follow these steps to get running with a local Excalidraw environment.

1. Clone the repo with `git clone git@github.com:switchboardcc/excalidraw.git`
2. Install the dependencies with `yarn install` or `npm install`
3. Start the app with `yarn start` or `npm run start`
4. Navigate to [http://localhost:3000](http://localhost:3000)

## Walkthrough

Our goal is to build a tour for first time users on top of Excalidraw. This tour will have a few steps:

1. Welcome to Excalidraw
2. Show how to use the rectangle tool
3. Show how to draw on the canvas
4. Show how to export a drawing
5. Congratulate the user on getting onboarded

We'll also have a diverging path after drawing a rectangle for users who are part of larger organizations:

4. Show how to share a drawing
5. Congratulate the user on getting onboarded

## Modeling

Models are a Switchboard concept and is the building block for defining the pieces of state that you need as part of your growth experience. In this case, we’re building out a tour so one way to think about it is to add a model for each step in the tour.

[![image](https://user-images.githubusercontent.com/604167/157954142-f98a4161-7312-4014-aae5-6d86aa74d0ef.png)](https://www.figma.com/proto/AKdbZcyjjkuhPiz0LLN0fG/Prototype-Storyboard?page-id=42%3A206&node-id=42%3A207&viewport=241%2C48%2C0.03&scaling=contain&starting-point-node-id=42%3A207)

Before we start implementing our tour UI, we'll need to model what state we want Switchboard to keep track for us in the Switchboard journey builder. Check out [this prototype](https://www.figma.com/proto/AKdbZcyjjkuhPiz0LLN0fG/Prototype-Storyboard?page-id=42%3A206&node-id=42%3A207&viewport=241%2C48%2C0.03&scaling=contain&starting-point-node-id=42%3A207) to get a sense of what that looks like.

## API

The Switchboard API offers access to limited access to `Users` and `States` in this prototype.

### Users

A user represents an end-user of a product that has Switchboard integrated into it.

#### Attributes

| Name      | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| id        | `string` | Unique identifier for the user |
| firstname | `string` | The first name of the user     |
| lastname  | `string` | The first name of the user     |
| email     | `string` | The email of the user          |

#### Endpoints

| Method | URI | Notes |
| --- | --- | --- |
| `GET` | [/api/users](https://sbdemoapi.vercel.app/api/users) |  |
| `GET` | [/api/users/{user-id}](https://sbdemoapi.vercel.app/api/users/1) | The DB has been seeded with users with id 1 through 100 |

### States

The state API allows you to access the state of some model for a given user.

#### Attributes

| Name | Type | Description |
| --- | --- | --- |
| started | `boolean` | RW attribute indicating whether the user has began interacting with the experience |
| finished | `boolean` | RW attribute indicating whether the user has finished interacting with the experience |
| active | `boolean` | RO attribute indicating whether this model is active for this user |

#### Endpoints

| Method | URI | Notes |
| --- | --- | --- |
| `GET` | [/api/users/{user-id}/states](https://sbdemoapi.vercel.app/api/users/1/states) |  |
| `GET` | [/api/users/{user-id}/states/{state-id}](https://sbdemoapi.vercel.app/api/users/1/states/welcome-cf7230a) |  |
| `PUT` | [/api/users/{user-id}/states/{state-id}](https://sbdemoapi.vercel.app/api/users/1/states/welcome-cf7230a) | State attributes in body |
| `POST` | [/api/users/{user-id}/states/reset](https://sbdemoapi.vercel.app/api/users/1/states/reset) | Convience enpoint for resetting a users State |

## SDK

The Switchboard React SDK offers conventient hooks to work with the Switchboard API.

### Installation

```bash
# Yarn
yarn add @switchboardcc/react-sdk-proto

# npm
npm install @switchboardcc/react-sdk-proto
```

### Usage

#### Wire the provider and identifying users

```js
import { SbProvider } from "@switchboardcc/react-sdk-proto";
import YourApp from "./YourApp";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <SbProvider userId={userId}>
    <YourApp />
  </SbProvider>,
  rootElement,
);
```

#### Accessing states

Having wired up the `<SbProvider />` you can now access Switchboard state from anywhere in `<YourApp />` using our provided hook `useSbState($model-reference-id$)` which can be described via the following types

#### Type definition

```ts
interface State {
  readonly active: boolean;
  started: boolean;
  finished: boolean;
}

const useSbState: (modelReferenceId: string) => [State, (state: State) => void];
```

#### Usage

```js
import { useSbState } from "@switchboardcc/react-sdk-proto";

const WelcomeModal = () => {
  const [state, setState] = useSbState("welcome-cf7230a");

  if (!state) {
    return null;
  }

  return (
    <Modal isOpen={state.active && !state.finished}>
      <ModalContent>
        <ModalBody>
          I'm a modal whose existence/visibility is controlled by Switchboard
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setState({ ...state, finished: true })}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
```

## UI integration

### Adding SbProvider

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/excalidraw-app/index.tsx#L84

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/excalidraw-app/index.tsx#L775-L783

</details>

Import `SbProvider` and reference it at the root of the app. This provides access to Switchboard state data to all of our UI components.

### Step 1: Welcome to Excalidraw

![image](https://user-images.githubusercontent.com/604167/157987239-abd26d82-f4e8-4280-bd0b-78f03cb168f9.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/excalidraw-app/index.tsx#L703-L730

</details>

Create a `Modal` for our welcome step. The visibility of this modal is controlled by the state of the `welcome-cf7230a` model. The modal also contains a handler to progress to the next tour step.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/excalidraw-app/index.tsx#L776-L782

</details>

Add this `WelcomeModal` to the root of our app.

### Step 2: Show how to use the rectangle tool

![image](https://user-images.githubusercontent.com/604167/157995600-766e915f-6736-4cd8-b5b5-76897c844a45.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/components/Actions.tsx#L184-L213

</details>

Add a `Popover` for our rectangle tool step. The visibility of this popover is controlled by the state of the `rectangle-tool-a40ea81` model.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/components/Actions.tsx#L235-L239

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/components/Actions.tsx#L255-L267

</details>

Add a handler to progress to the next tour step.

### Step 3: Show how to draw on the canvas

![image](https://user-images.githubusercontent.com/604167/157995656-2636485d-aaf9-4daa-a41b-81f32592e891.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/excalidraw-app/index.tsx#L732-L768

</details>

Create a `Modal` for our draw step. This modal is controlled by the state of the `draw-afcee69` model. The modal also listens for when the user interacts with the canvas to progress to the next tour step.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/excalidraw-app/index.tsx#L776-L782

</details>

Add this `DrawASquare` to the root of our app.

### Step 4: Show how to export a drawing

![image](https://user-images.githubusercontent.com/604167/157987466-5700c92b-c432-47b8-9f80-0fc490d1505b.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/components/JSONExportDialog.tsx#L116-L143

</details>

Create a `Popover` for our export step. This popover is controlled by the state of the `export-78e5a70` model. The popover also contains a handler to progress to the next tour step.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/components/JSONExportDialog.tsx#L172-L201

</details>

Add this `ExportButtonWrapper` to the export button.

### Step 5: Congratulate the user on getting onboarded

![image](https://user-images.githubusercontent.com/604167/157956502-cbac0965-abce-4f9f-92e2-4a2cc410d197.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/components/JSONExportDialog.tsx#L55-L68

</details>

Add an `Alert` to the export modal for our congratulate step. This alert is controlled by the state of the `congratulations-db59ae1` model.

### (Branch) Step 4: Show how to share a drawing

![image](https://user-images.githubusercontent.com/604167/157987548-531a90c9-3d65-49e9-a7dc-0f05c79f98ce.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/components/CollabButton.tsx#L19-L45

</details>

For this branching path, create a `Popover` for our share step. This popover is controlled by the state of the `share-78e5c60` model. The popover also contains a handler to progress ot the next tour step.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/components/CollabButton.tsx#L58-L77

</details>

Add this `CollabButtonWrapper` to the share button.

### (Branch) Step 5: Congratulate the user on getting onboarded

![image](https://user-images.githubusercontent.com/604167/157957091-8e178321-6897-483b-9c29-bab334782ce9.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/504e83abf34be3090c4142026084d8b610a7dff2/src/excalidraw-app/collab/RoomDialog.tsx#L109-L125

</details>

For this branching path, add an `Alert` to the share modal for our congratulate step. This alert is controlled by the state of the `congratulations-df49ae1` model.
