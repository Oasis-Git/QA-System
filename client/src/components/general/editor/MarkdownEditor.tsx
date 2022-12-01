import { useEffect, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import useAppearance from "../../../hooks/useAppearance";
import { Resource } from "../../../hooks/useFileUpload";
import useAuth from "../../../hooks/user/useAuth";
import { ApiResponse } from "../../../types/ApiResponse";

export type MarkdownEditorProps = {
  height: number;
  value: string;
  onChange: (value: string) => void;
};

const MarkdownEditor = ({
  height,
  value,
  onChange,
}: MarkdownEditorProps): JSX.Element => {
  const appearance = useAppearance();
  const auth = useAuth();
  const [, setVditor] = useState<Vditor | null>(null);

  useEffect(() => {
    const vditor = new Vditor("markdown-editor", {
      height,
      placeholder: "TODO 这里填什么啊？",
      toolbar: [
        "headings",
        "bold",
        "italic",
        "strike",
        "|",
        "line",
        "quote",
        "link",
        "inline-code",
        "code",
        "table",
        "emoji",
        "upload",
        "|",
        "list",
        "ordered-list",
        "check",
        "outdent",
        "indent",
        "|",
        "edit-mode",
        "undo",
        "redo",
        "export",
        "fullscreen",
        "|",
        "info",
        "help",
      ],
      counter: { enable: true },
      cache: { enable: false },
      mode: "ir",
      preview: {
        hljs: {
          lineNumber: true,
          style: appearance.getThemeMode() === "light" ? "github" : "dracula",
        },
        math: { inlineDigit: true },
        theme: { current: appearance.getThemeMode() },
      },
      theme: appearance.getThemeMode() === "light" ? "classic" : "dark",
      icon: "material",
      upload: {
        url: "/api/upload",
        headers: (() => {
          const accessToken = auth.getAccessToken();
          return accessToken === null
            ? undefined
            : { Authorization: accessToken };
        })(),
        fieldName: "files",
        filename: filename => filename,
        format(files, response_) {
          const response = JSON.parse(response_) as ApiResponse<Resource[]>;
          const failed: string[] = [];
          const success: Record<string, string> = {};
          response.data.forEach(({ filename, url }) => {
            if (url === undefined) {
              failed.push(filename);
            } else {
              success[filename] = url;
            }
          });
          return JSON.stringify({
            msg: "",
            code: 0,
            data: {
              errFiles: failed,
              succMap: success,
            },
          });
        },
      },
      tab: "  ",
      input() {
        onChange(vditor.getValue()); // TODO 在空内容的时候切主题貌似还是有问题
      },
      value,
    });
    setVditor(vditor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appearance, auth, height, onChange]);
  return <div id="markdown-editor" />;
};
export default MarkdownEditor;
