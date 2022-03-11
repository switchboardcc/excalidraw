# Switchboard on Excalidraw

## Overview

This repository showcases what creating a growth experience with Switchboard looks like. For this demo, we'll be building on top of [Excalidraw](https://github.com/excalidraw/excalidraw), an open source tool for drawing and diagramming. We've also pulled in some basic UI components from [Chakra UI](https://chakra-ui.com/), a React component library.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/getting-started/install) (v1 or v2.4.2+)
- [Git](https://git-scm.com/downloads)

## Getting started

Follow these steps to get running with a local Excalidraw environment.

1. Clone the repo with `git clone git@github.com:switchboardcc/excalidraw.git`
2. Install the dependencies with `yarn install`
3. Start the app with `yarn start`
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
id `string`<br>
Unique identifier for the user<br>

firstname `string`<br>
The first name of the user<br>

lastname `string`<br>
The first name of the user<br>

email `string`<br>
The email of the user<br>



#### Endpoints
```
GET /api/users
GET /api/users/{user-id} // the DB has been seeded with users with id 1 through 100
```

### States

The state API allows you to access the state of some model for a given user.

#### Attributes
started `boolean`<br>
RW attribute indicating whether the user has began interacting with the experience<br>

finished `boolean`<br>
RW attribute indicating whether the user has finished interacting with the experience<br>

active `boolean`<br>
RO attribute indicating whether this model is active for this user<br>

#### Endpoints
```
GET   /api/users/{user-id}/states
GET   /api/users/{user-id}/states/{state-id}
PUT   /api/users/{user-id}/states/{state-id} // State attributes in body
POST  /api/users/{user-id}/states/reset      // Convience enpoint for resetting a users State
```


## SDK

## Installation

Via Yarn
```bash
yarn add @switchboardcc/react-sdk-proto
```
Via npm
```bash
npm install @switchboardcc/react-sdk-proto
```

## Usage

### Wire the Provider and Identifying Users

```javascript
import { SbProvider } from "@switchboardcc/react-sdk-proto"
import YourApp from './YourApp';

const rootElement = document.getElementById('root');
ReactDOM.render(  
   <SbProvider userId={userId}>    
     <YourApp />  
   </SbProvider>,  
   rootElement
);
```

### Accessing states

Having wired up the `<SbProvider />` you can now access 
Switchboard state from anywhere in `<YourApp />` using 
our provided hook `useSbState($model-reference-id$)`
which can be described via the following types

#### Type Definition
```
interface State {
  readonly active: boolean;
  started: boolean;
  finished: boolean;
}

const useSbState: (modelReferenceId: string) => [State, (state: State) => void];

```
#### Usage
```javascript
import { useSbState } from "@switchboardcc/react-sdk-proto"

const WelcomeModal = () => {
  const [state, setState] = useSbState("welcome-cf7230a");

  if (!state) {
    return null;
  }

  return (
    <Modal isOpen={state.active && !state.finished}>
      <ModalContent border="1px" borderColor="gray.200">
        <ModalBody p={7}>
          I'm a modal whose existence/visibility is controlled by Switchboard
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
```

## UI integration

### Adding SbProvider

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/14296fb26db7eee6bcbcc9df273f937c7c2cfc62/src/excalidraw-app/index.tsx#L90

https://github.com/switchboardcc/excalidraw/blob/14296fb26db7eee6bcbcc9df273f937c7c2cfc62/src/excalidraw-app/index.tsx#L783-L791

</details>

Import `SbProvider` and reference it at the root of the app. This provides access to Switchboard state data to all of our UI components.

### Step 1: Welcome to Excalidraw

![image](https://user-images.githubusercontent.com/604167/157987239-abd26d82-f4e8-4280-bd0b-78f03cb168f9.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/14296fb26db7eee6bcbcc9df273f937c7c2cfc62/src/excalidraw-app/index.tsx#L709-L738

</details>

Create a `Modal` for our welcome step. The visibility of this modal is controlled by the state of the `welcome-cf7230a` model. The modal also contains a handler to progress to the next tour step.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/14296fb26db7eee6bcbcc9df273f937c7c2cfc62/src/excalidraw-app/index.tsx#L784-L790

</details>

Add this `WelcomeModal` to the root of our app.

### Step 2: Show how to use the rectangle tool

![image](https://user-images.githubusercontent.com/604167/157987319-fee253d3-c84d-4fb5-a4d6-0584b6c97c30.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/14296fb26db7eee6bcbcc9df273f937c7c2cfc62/src/components/Actions.tsx#L184-L207

</details>

Add a `Popover` for our rectangle tool step. The visibility of this popover is controlled by the state of the `rectangle-tool-a40ea81` model.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/14296fb26db7eee6bcbcc9df273f937c7c2cfc62/src/components/Actions.tsx#L244-L247

</details>

Add a handler to progress to the next tour step.

### Step 3: Show how to draw on the canvas

![image](https://user-images.githubusercontent.com/604167/157987367-b81c7b8d-3d20-400b-b1ed-a1c8c74a9bf5.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/14296fb26db7eee6bcbcc9df273f937c7c2cfc62/src/excalidraw-app/index.tsx#L740-L776

</details>

Create a `Modal` for our draw step. This modal is controlled by the state of the `draw-afcee69` model. The modal also listens for when the user interacts with the canvas to progress to the next tour step.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/14296fb26db7eee6bcbcc9df273f937c7c2cfc62/src/excalidraw-app/index.tsx#L784-L790

</details>

Add this `DrawASquare` to the root of our app.

### Step 4: Show how to export a drawing

![image](https://user-images.githubusercontent.com/604167/157987466-5700c92b-c432-47b8-9f80-0fc490d1505b.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/36909fa76ade5bfd1003028fe1fb5728b46b173e/src/components/JSONExportDialog.tsx#L115-L142

</details>

Create a `Popover` for our export step. This popover is controlled by the state of the `export-78e5a70` model. The popover also contains a handler to progress to the next tour step.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/36909fa76ade5bfd1003028fe1fb5728b46b173e/src/components/JSONExportDialog.tsx#L171-L200

</details>

Add this `ExportButtonWrapper` to the export button.

### Step 5: Congratulate the user on getting onboarded

![image](https://user-images.githubusercontent.com/604167/157956502-cbac0965-abce-4f9f-92e2-4a2cc410d197.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/36909fa76ade5bfd1003028fe1fb5728b46b173e/src/components/JSONExportDialog.tsx#L55-L67

</details>

Add an `Alert` to the export modal for our congratulate step. This alert is controlled by the state of the `congratulations-db59ae1` model.

### (Branch) Step 4: Show how to share a drawing

![image](https://user-images.githubusercontent.com/604167/157987548-531a90c9-3d65-49e9-a7dc-0f05c79f98ce.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/210909b73f2954004fb0c47f04d779f20911e9a6/src/components/CollabButton.tsx#L19-L45

</details>

For this branching path, create a `Popover` for our share step. This popover is controlled by the state of the `share-78e5c60` model. The popover also contains a handler to progress ot the next tour step.

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/210909b73f2954004fb0c47f04d779f20911e9a6/src/components/CollabButton.tsx#L58-L77

</details>

Add this `CollabButtonWrapper` to the share button.

### (Branch) Step 5: Congratulate the user on getting onboarded

![image](https://user-images.githubusercontent.com/604167/157957091-8e178321-6897-483b-9c29-bab334782ce9.png)

<details>
  <summary>Show code</summary>

https://github.com/switchboardcc/excalidraw/blob/210909b73f2954004fb0c47f04d779f20911e9a6/src/excalidraw-app/collab/RoomDialog.tsx#L109-L121

</details>

For this branching path, add an `Alert` to the share modal for our congratulate step. This alert is controlled by the state of the `congratulations-df49ae1` model.
