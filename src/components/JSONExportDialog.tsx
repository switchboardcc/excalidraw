import React, { useState } from "react";
import { ActionsManagerInterface } from "../actions/types";
import { NonDeletedExcalidrawElement } from "../element/types";
import { t } from "../i18n";
import { useIsMobile } from "./App";
import { AppState, ExportOpts, BinaryFiles } from "../types";
import { Dialog } from "./Dialog";
import { exportFile, exportToFileIcon, link } from "./icons";
import { ToolButton } from "./ToolButton";
import { actionSaveFileToDisk } from "../actions/actionExport";
import { Card } from "./Card";

import {
  Alert,
  AlertIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";

import "./ExportDialog.scss";
import { nativeFileSystemSupported } from "../data/filesystem";
import { useDopt } from "@dopt/react";

export type ExportCB = (
  elements: readonly NonDeletedExcalidrawElement[],
  scale?: number,
) => void;

const JSONExportModal = ({
  elements,
  appState,
  files,
  actionManager,
  exportOpts,
  canvas,
}: {
  appState: AppState;
  files: BinaryFiles;
  elements: readonly NonDeletedExcalidrawElement[];
  actionManager: ActionsManagerInterface;
  onCloseRequest: () => void;
  exportOpts: ExportOpts;
  canvas: HTMLCanvasElement | null;
}) => {
  const { onExportToBackend } = exportOpts;

  const [{ active }, { complete }] = useDopt("72IsJgtFODxZyf8lWTjFL");
  return (
    <div className="ExportDialog ExportDialog--json">
      {active && (
        <Alert
          colorScheme="purple"
          status="success"
          variant="subtle"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius={6}
        >
          🎉 You did it! You’re an Excalidraw pro now!
        </Alert>
      )}
      <div className="ExportDialog-cards">
        {exportOpts.saveFileToDisk && (
          <Card color="lime">
            <div className="Card-icon">{exportToFileIcon}</div>
            <h2>{t("exportDialog.disk_title")}</h2>
            <div className="Card-details">
              {t("exportDialog.disk_details")}
              {!nativeFileSystemSupported &&
                actionManager.renderAction("changeProjectName")}
            </div>
            <ToolButton
              className="Card-button"
              type="button"
              id="SB-save"
              title={t("exportDialog.disk_button")}
              aria-label={t("exportDialog.disk_button")}
              showAriaLabel={true}
              onClick={() => {
                actionManager.executeAction(actionSaveFileToDisk);
              }}
            />
          </Card>
        )}
        {onExportToBackend && (
          <Card color="pink">
            <div className="Card-icon">{link}</div>
            <h2>{t("exportDialog.link_title")}</h2>
            <div className="Card-details">{t("exportDialog.link_details")}</div>
            <ToolButton
              className="Card-button"
              type="button"
              title={t("exportDialog.link_button")}
              aria-label={t("exportDialog.link_button")}
              showAriaLabel={true}
              onClick={() =>
                onExportToBackend(elements, appState, files, canvas)
              }
            />
          </Card>
        )}
        {exportOpts.renderCustomUI &&
          exportOpts.renderCustomUI(elements, appState, files, canvas)}
      </div>
    </div>
  );
};

const ExportButtonWrapper = (props: any) => {
  const [{ active }] = useDopt("JfEa5JehaffKM51MnRprg");
  if (!active) {
    return props.children;
  }
  return (
    <Popover isOpen={active}>
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
      <PopoverContent p={2} boxShadow="lg">
        <PopoverArrow />
        <PopoverBody>
          Looking good! Let’s export this drawing so you can share it with
          others.{" "}
          <strong>
            Click the Save as image button to save this as a PNG, SVG, or copy
            it to your clipboard.
          </strong>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export const JSONExportDialog = ({
  elements,
  appState,
  files,
  actionManager,
  exportOpts,
  canvas,
}: {
  elements: readonly NonDeletedExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
  actionManager: ActionsManagerInterface;
  exportOpts: ExportOpts;
  canvas: HTMLCanvasElement | null;
}) => {
  const [modalIsShown, setModalIsShown] = useState(false);

  const doptCongrats = useDopt("anfx1Duz-ahZ7dCRLYreh");

  const handleClose = React.useCallback(() => {
    doptCongrats[1].complete();
    setModalIsShown(false);
  }, [doptCongrats]);
  const doptExport = useDopt("JfEa5JehaffKM51MnRprg");

  return (
    <ExportButtonWrapper>
      <ToolButton
        onClick={() => {
          if (doptExport[0].active) {
            doptExport[1].complete();
          }
          setModalIsShown(true);
        }}
        data-testid="json-export-button"
        id="SB-export"
        icon={exportFile}
        type="button"
        aria-label={t("buttons.export")}
        showAriaLabel={useIsMobile()}
        title={t("buttons.export")}
      />
      {modalIsShown && (
        <Dialog onCloseRequest={handleClose} title={t("buttons.export")}>
          <JSONExportModal
            elements={elements}
            appState={appState}
            files={files}
            actionManager={actionManager}
            onCloseRequest={handleClose}
            exportOpts={exportOpts}
            canvas={canvas}
          />
        </Dialog>
      )}
    </ExportButtonWrapper>
  );
};
