export const logInfo = (user: any, actionDesc: string) => {
    console.info("[" + user?.email + ", " + user?.role + "]: " + actionDesc)
};

export const logError = (user: any, errorCode: string, errorDesc: string) => {
    console.error("*" + errorCode +  "*" + " [" + user?.email + ", " + user?.role + "]: " + errorDesc)
};

export const logInfoNoAccount = ( actionDesc: string) => {
    console.error("[User]: " + actionDesc)
};


export const logErrorNoAccount = (errorCode: string, errorDesc: string) => {
    console.error("*" + errorCode +  "*: " + errorDesc)
};
