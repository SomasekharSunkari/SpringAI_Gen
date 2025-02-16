function injectButton() {
    const existingButton = document.querySelector(".ai-replay-button");
    if (existingButton) {
        existingButton.remove();
    }

    const toolbar = findToolbar();
    if (!toolbar) {
        console.log("Toolbar Not Found!");
        return;
    }

    console.log("Toolbar Found, Creating AI Button");
    const AIbutton = createButton();

    AIbutton.addEventListener("click", async () => {
        try {
            AIbutton.disabled = true;
            AIbutton.innerHTML = "Generating...";
            const emailContent = getEmailContent();

            if (!emailContent) {
                throw new Error("No email content found!");
            }

            const response = await fetch("http://localhost:8084/api/email/generate", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            if (!response.ok) {
                throw new Error("API Request Failed!");
            }

            const generatedContent = await response.text();
            const composedBox = document.querySelector('[role="textbox"][g_editable="true"]');


            if (composedBox) {
                console.log("Composed Box Founed")
                composedBox.focus();
                document.execCommand('insertText', false, generatedContent);
            } else {
                console.log("Compose Box Not Found");
                alert("Compose Box Not Found!");
            }
        } catch (e) {
            alert("Error: " + e.message);
            console.error(e);
        } finally {
            AIbutton.disabled = false;
            AIbutton.innerHTML = "AI Reply";
        }
    });

    toolbar.insertBefore(AIbutton, toolbar.firstChild);
}

function createButton() {
    const button = document.createElement("div");
    button.className = 'T-J J-J5-Ji aoO v7 T-I-atl L3 ai-replay-button';
    button.style.marginRight = "8px";
    button.innerHTML = "AI Reply";
    button.setAttribute("role", "button");
    button.setAttribute("data-tooltip", "Generate AI Reply");
    return button;
}

function getEmailContent() {
    const selectors = ['.h7', '.a3s.aiL', '[role="presentation"]', 'gmail_quota'];

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            console.log("Email Content Found:", content.innerText.trim());
            return content.innerText.trim();
        }
    }
    return ""; // Return an empty string if no content is found
}

function findToolbar() {
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];

    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null; // Return null if no toolbar is found
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);

        // Check if any added node matches toolbar selectors
        const hasComposedNodes = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="region"]') || node.querySelector('.aDh, .btC, [role="region"]'))
        );

        if (hasComposedNodes) {
            console.log("Compose Elements Triggered");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});




