import clsx from "clsx";
import { ToolButton } from "./ToolButton";
import { t } from "../i18n";
import { useIsMobile } from "../components/App";
import { users } from "./icons";
import { useSbState } from "@switchboardcc/react-sdk-proto";

import "./CollabButton.scss";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";

const CollabButtonWrapper = (props: any) => {
  const [state, setState] = useSbState("share-78e5c60");
  if (!state || !state.active || state.finished) {
    return props.children;
  }
  return (
    <Popover isOpen={!state.finished}>
      <PopoverTrigger>
        <div
          style={{
            borderRadius: "var(--border-radius-lg)",
            boxShadow: "0 0 0 3px var(--color-primary)",
          }}
        >
          {props.children}
        </div>
      </PopoverTrigger>
      <PopoverContent p={2} pr={6}>
        <PopoverArrow />
        <PopoverCloseButton
          onClick={() => {
            if (!state.finished) {
              setState({ ...state, finished: true });
            }
          }}
        />
        <PopoverBody>
          Looking good! Let’s invite a coworker to help us make this drawing
          even better. <strong>Click the Live collaboration button.</strong>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const CollabButton = ({
  isCollaborating,
  collaboratorCount,
  onClick,
}: {
  isCollaborating: boolean;
  collaboratorCount: number;
  onClick: () => void;
}) => {
  const [state, setState] = useSbState("share-78e5c60");
  return (
    <CollabButtonWrapper>
      <ToolButton
        className={clsx("CollabButton", {
          "is-collaborating": isCollaborating,
        })}
        onClick={() => {
          setState({ ...state, finished: true });
          onClick();
        }}
        icon={users}
        type="button"
        title={t("labels.liveCollaboration")}
        aria-label={t("labels.liveCollaboration")}
        showAriaLabel={useIsMobile()}
      >
        {collaboratorCount > 0 && (
          <div className="CollabButton-collaborators">{collaboratorCount}</div>
        )}
      </ToolButton>
    </CollabButtonWrapper>
  );
};

export default CollabButton;
