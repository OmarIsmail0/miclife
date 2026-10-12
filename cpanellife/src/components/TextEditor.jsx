import "react-quill-new/dist/quill.snow.css";
import PropTypes from "prop-types";
import ReactQuill from "react-quill-new";

const TextEditor = ({
  value,
  onChange,
  language = "en",
  placeholder = "Enter text...",
  height = "200px",
  className = "",
  ...props
}) => {
  // ReactQuill configuration - text formatting, lists, colors, direction, and font size
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }, { direction: "rtl" }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "direction",
  ];

  // Ensure value is always a string (ReactQuill requires string)
  const editorValue = value || "";

  return (
    <div className={`quill-editor ${language === "ar" ? "rtl" : "ltr"} ${className}`}>
      <ReactQuill
        value={editorValue}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        theme="snow"
        placeholder={placeholder}
        style={{
          height: height,
          direction: language === "ar" ? "rtl" : "ltr",
          marginBottom: 16,
        }}
        {...props}
      />
    </div>
  );
};

TextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  language: PropTypes.string,
  placeholder: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
};

export default TextEditor;
