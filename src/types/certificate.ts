export type Certificate = {
    id: string;
    eventId: string;
    name: string;
    templatePath: string;
    outputPath: string;
    textX: number;
    textY: number;
    textWidth: number;
    textHeight: number;
    fontSize: number;
    fontFamily: string;
    textColor: string;
  };
  
export type Position = {
    id: number;
    name: string;
    x: number;
    y: number;
    fontSize: number;
    sigId : string;
    sigImage: string;
    width: number;
    height: number;
  };

export type CanvasSize = {
    width: number;
    height: number;
  };

export type Event = {
  id : string;
  title : string;
  slug : string;
}