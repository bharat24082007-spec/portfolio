/*==============================================================*/
// Contact Form JS with Web3Forms AJAX
/*==============================================================*/
(function ($) {
    "use strict";

    var $form = $("#contactForm");
    if (!$form.length) return;

    // Attach submit listener
    if ($.fn.validator) {
        $form.validator().on("submit", function (event) {
            if (event.isDefaultPrevented()) {
                formError();
                submitMSG(false, "Please fill in all required fields properly.");
            } else {
                event.preventDefault();
                submitForm();
            }
        });
    } else {
        $form.on("submit", function (event) {
            event.preventDefault();
            submitForm();
        });
    }

    function submitForm() {
        var formElement = $form[0];
        var formData = new FormData(formElement);

        // Ensure access_key is always included
        if (!formData.get("access_key")) {
            formData.append("access_key", "77a383a5-5de9-4a41-9b96-8f8ad11dd1f0");
        }

        var $submitBtn = $form.find('button[type="submit"]');
        var originalBtnContent = $submitBtn.html();

        // Disable button while sending to prevent double submits
        $submitBtn.prop("disabled", true).addClass("disabled").html('Sending... <i class="ri-loader-4-line"></i>');
        submitMSG(false, "");

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(function (response) {
            return response.json().then(function (data) {
                return { ok: response.ok, status: response.status, data: data };
            });
        })
        .then(function (res) {
            if (res.ok && res.data && res.data.success) {
                formSuccess();
                submitMSG(true, "Thanks, your message has been sent");
            } else {
                formError();
                var errorMsg = (res.data && res.data.message) ? res.data.message : "Sorry, Message could not send! Please try again.";
                submitMSG(false, errorMsg);
            }
        })
        .catch(function (error) {
            formError();
            submitMSG(false, "Sorry, Message could not send! Please try again.");
        })
        .finally(function () {
            // Re-enable Send button
            $submitBtn.prop("disabled", false).removeClass("disabled").html(originalBtnContent);
        });
    }

    function formSuccess() {
        $form[0].reset();
        if ($form.data('bs.validator')) {
            $form.data('bs.validator').reset();
        }
        $form.find(".has-error").removeClass("has-error");
        $form.find(".help-block.with-errors").empty();
    }

    function formError() {
        $form.removeClass('shake animated').addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('shake animated');
        });
    }

    function submitMSG(valid, msg) {
        var $msgSubmit = $("#msgSubmit");
        if (!msg) {
            $msgSubmit.addClass("hidden d-none").hide().text("");
            return;
        }
        var msgClasses = valid ? "h4 text-success tada animated" : "h4 text-danger";
        $msgSubmit.removeClass("hidden d-none").show().removeClass("text-success text-danger tada animated").addClass(msgClasses).text(msg);
    }
}(jQuery));
