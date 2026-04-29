function simulateStreaming(fullText: string) {
    const safeText = typeof fullText === 'string' ? fullText : String(fullText);
    const words = safeText.split(/(\s+)/);
    console.log('Words:', words);
}

simulateStreaming("");
simulateStreaming("hello undefined world");
simulateStreaming(undefined as any);
