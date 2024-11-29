<template>
  <div>
    <blockquote
      class="instagram-media"
      data-instgrm-permalink="https://www.instagram.com/reel/DBu1htVJz57/?utm_source=ig_embed&amp;utm_campaign=loading"
      data-instgrm-version="14"
      style="
        background: #fff;
        border: 0;
        border-radius: 3px;
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5),
          0 1px 10px 0 rgba(0, 0, 0, 0.15);
        margin: 1px;
        max-width: 540px;
        min-width: 326px;
        padding: 0;
        width: 99.375%;
        width: -webkit-calc(100% - 2px);
        width: calc(100% - 2px);
      "
    >
      <div style="padding: 16px">
        <a
          href="https://www.instagram.com/reel/DBu1htVJz57/?utm_source=ig_embed&amp;utm_campaign=loading"
          style="
            background: #ffffff;
            line-height: 0;
            padding: 0 0;
            text-align: center;
            text-decoration: none;
            width: 100%;
          "
          target="_blank"
        >
          <div style="padding: 19% 0"></div>

          <div style="padding-top: 8px">
            <div
              style="
                color: #3897f0;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-style: normal;
                font-weight: 550;
                line-height: 18px;
              "
            >
              View this post on Instagram
            </div>
          </div>
          <div style="padding: 12.5% 0"></div>
          <div
            style="
              display: flex;
              flex-direction: row;
              margin-bottom: 14px;
              align-items: center;
            "
          >
            <div></div>
            <div style="margin-left: 8px">
              <div
                style="
                  background-color: #f4f4f4;
                  border-radius: 50%;
                  flex-grow: 0;
                  height: 20px;
                  width: 20px;
                "
              ></div>
              <div
                style="
                  width: 0;
                  height: 0;
                  border-top: 2px solid transparent;
                  border-left: 6px solid #f4f4f4;
                  border-bottom: 2px solid transparent;
                  transform: translateX(16px) translateY(-4px) rotate(30deg);
                "
              ></div>
            </div>
            <div style="margin-left: auto">
              <div
                style="
                  width: 0px;
                  border-top: 8px solid #f4f4f4;
                  border-right: 8px solid transparent;
                  transform: translateY(16px);
                "
              ></div>
              <div
                style="
                  background-color: #f4f4f4;
                  flex-grow: 0;
                  height: 12px;
                  width: 16px;
                  transform: translateY(-4px);
                "
              ></div>
              <div
                style="
                  width: 0;
                  height: 0;
                  border-top: 8px solid #f4f4f4;
                  border-left: 8px solid transparent;
                  transform: translateY(-4px) translateX(8px);
                "
              ></div>
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              justify-content: center;
              margin-bottom: 24px;
            "
          >
            <div
              style="
                background-color: #f4f4f4;
                border-radius: 4px;
                flex-grow: 0;
                height: 14px;
                margin-bottom: 6px;
                width: 224px;
              "
            ></div>
            <div
              style="
                background-color: #f4f4f4;
                border-radius: 4px;
                flex-grow: 0;
                height: 14px;
                width: 144px;
              "
            ></div></div
        ></a>
        <p
          style="
            color: #c9c8cd;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 17px;
            margin-bottom: 0;
            margin-top: 8px;
            overflow: hidden;
            padding: 8px 0 7px;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
        >
          <a
            href="https://www.instagram.com/reel/DBu1htVJz57/?utm_source=ig_embed&amp;utm_campaign=loading"
            style="
              color: #c9c8cd;
              font-family: Arial, sans-serif;
              font-size: 14px;
              font-style: normal;
              font-weight: normal;
              line-height: 17px;
              text-decoration: none;
            "
            target="_blank"
            >A post shared by Maple and Morty (@mapleandmortycorgi)</a
          >
        </p>
      </div>
    </blockquote>
  </div>
</template>

<script setup>
import axios from "axios";

const posts = ref([]);

axios
  .get("https://api.instagram.com/v1/users/self/media/recent", {
    params: {
      access_token: "098a485f00e0c75b34f82c912c02d383",
    },
  })
  .then((response) => {
    this.posts = response.data.data;
  })
  .catch((error) => {
    console.log(error);
  });
</script>
