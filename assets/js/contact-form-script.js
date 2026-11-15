/*==============================================================*/
// Contact Form JS with Web3Forms AJAX
/*==============================================================*/
(function ($) {
    "use strict";

    $(function () {
        var $form = $("#contactForm");
        var $msgSubmit = $("#msgSubmit");

        if (!$form.length) return;

        // Hide message on page load so it never shows by default
        hideMessage();

        function hideMessage() {
            $msgSubmit.hide().empty().removeClass("text-success text-danger");
        }

        function showMessage(isSuccess, text) {
            $msgSubmit.removeClass("text-success text-danger")
                      .addClass(isSuccess ? "h4 text-success" : "h4 text-danger")
                      .text(text)
                      .fadeIn(200);
        }

        // Single submit handler
        $form.off("submit").on("submit", async function (event) {
            event.preventDefault();

            // Hide the error message at the start of every submit
            hideMessage();

            var formElement = $form[0];
            var formData = new FormData(formElement);

            // Ensure access_key is included in FormData
            if (!formData.get("access_key")) {
                formData.append("access_key", "77a383a5-5de9-4a41-9b96-8f8ad11dd1f0");
            }

            var $submitBtn = $form.find('button[type="submit"]');
            var originalBtnHtml = $submitBtn.html();

            // Disable Send button while sending to stop double submits
            $submitBtn.prop("disabled", true).addClass("disabled").html('Sending... <i class="ri-loader-4-line"></i>');

            try {
                var response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                var data = await response.json();

                // console.log the full response object on every submit
                console.log("Web3Forms response:", data);

                if (data && data.success === true) {
                    formElement.reset();
                    showMessage(true, "Thanks, your message has been sent");
                } else {
                    var errorMsg = (data && data.message) ? data.message : "Sorry, Message could not send! Please try again.";
                    showMessage(false, errorMsg);
                }
            } catch (error) {
                console.error("Submission error:", error);
                showMessage(false, "Sorry, Message could not send! Please try again.");
            } finally {
                // Re-enable Send button in finally block
                $submitBtn.prop("disabled", false).removeClass("disabled").html(originalBtnHtml);
            }
        });
    });
}(jQuery));
