import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { Download, Save, Upload } from 'lucide-react';

function App() {
  const excalidrawRef = React.useRef<any>(null);

  const saveToFile = async () => {
    if (!excalidrawRef.current) return;
    
    const elements = excalidrawRef.current.getSceneElements();
    const appState = excalidrawRef.current.getAppState();
    
    const fileData = {
      type: "excalidraw",
      version: 2,
      source: "excalidraw-clone",
      elements: elements,
      appState: appState
    };

    try {
      const blob = new Blob([JSON.stringify(fileData)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const link = document.createElement('a');
      link.href = url;
      link.download = `drawing-${timestamp}.excalidraw`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const loadFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.excalidraw';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const contents = await file.text();
          const data = JSON.parse(contents);
          if (excalidrawRef.current) {
            excalidrawRef.current.updateScene(data);
          }
        } catch (error) {
          console.error('Error loading file:', error);
          alert('Error loading file. Please make sure it\'s a valid .excalidraw file.');
        }
      }
    };
    input.click();
  };

  return (
    <div className="h-screen w-screen">
      <Excalidraw
        ref={excalidrawRef}
        initialData={{
          appState: {
            viewBackgroundColor: '#ffffff',
            currentItemStrokeColor: '#000000',
            currentItemBackgroundColor: 'transparent',
            currentItemFontFamily: 1,
            defaultFontFamily: 1,
            elementType: "selection",
            elements: [],
            files: [],
            theme: {
              isDark: false,
              isSystemTheme: false,
              appearance: "light",
              colors: {
                primary: "#D81B60",
                primaryDark: "#AD1457",
                primaryLight: "#F06292",
                secondary: "#6A1B9A",
                secondaryDark: "#4A148C",
                secondaryLight: "#9C27B0",
                background: "#FFFFFF",
                border: "#E0E0E0",
                text: "#424242",
                textLight: "#757575",
                textMuted: "#9E9E9E",
                error: "#D32F2F",
                success: "#388E3C",
                warning: "#F57C00"
              }
            },
            fontFamilies: [
              { fontFamily: "Virgil", id: 1 },
              { fontFamily: "Helvetica", id: 2 },
              { fontFamily: "Cascadia", id: 3 },
              { fontFamily: "Comic Shanns", id: 4 },
              { fontFamily: "Nunito", id: 5 },
              { fontFamily: "Lilia One", id: 6 }
            ]
          },
        }}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: false,
            saveToActiveFile: false,
            theme: false,
            changeViewBackgroundColor: false,
            menu: false,
            links: false
          },
        }}
        renderTopRightUI={() => (
          <div className="flex items-center gap-3 p-2">
            <button
              className="flex items-center gap-2 rounded-md bg-[#E91E63] px-4 py-2 text-sm font-medium text-white hover:bg-[#D81B60] transition-colors"
              onClick={() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                  const link = document.createElement('a');
                  link.download = 'excalidraw-drawing.png';
                  link.href = canvas.toDataURL();
                  link.click();
                }
              }}
            >
              <Download size={18} />
              Export PNG
            </button>
            <button
              className="flex items-center gap-2 rounded-md bg-[#673AB7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5E35B1] transition-colors"
              onClick={saveToFile}
            >
              <Save size={18} />
              Save
            </button>
            <button
              className="flex items-center gap-2 rounded-md bg-[#673AB7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5E35B1] transition-colors"
              onClick={loadFromFile}
            >
              <Upload size={18} />
              Load
            </button>
          </div>
        )}
      />
    </div>
  );
}

export default App;