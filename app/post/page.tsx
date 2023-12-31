"use client";
import React, { useEffect, useState } from "react";
import { makeFileObjects, storeFiles } from "@/hooks/useweb3Storage";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/hooks/useNotification";
import useExplore from "@/hooks/useExplore";
import dynamic from "next/dynamic";

const ABI = require("../../abis/PledgePost.json").abi;
const RichEditor = dynamic(() => import("@/components/RichEditor"), {
  ssr: false,
});
const contract_address: any = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Post() {
  const [value, setValue] = useState(
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad itaque vitae a illo in molestias adipisci tenetur officiis molestiae earum veniam, harum non doloribus error voluptates dignissimos necessitatibus quos sit!"
  );
  const [title, setTitle] = useState("Lorem ipsum dolor sit amet consectetur");
  const [obj, setObj] = useState({});
  const { chain } = useNetwork();
  const { address } = useAccount();
  const url = useExplore();
  let timestamp = new Date();
  let unix = timestamp.getTime();
  let UNIXtimestamp = Math.floor(unix / 1000);
  const { data, write: post } = useContractWrite({
    address: contract_address,
    abi: ABI,
    functionName: "postArticle",
    chainId: chain?.id,
    onError(error) {
      console.log("Error", error);
      showErrorToast(error.message);
    },
  });
  const { data: txreceipt } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (txreceipt) => {
      if (txreceipt) {
        showSuccessToast(`${url}/tx/${txreceipt.transactionHash}`);
      }
    },
  });
  useEffect(() => {
    if (txreceipt) {
      console.log("Receipt: ", txreceipt);
    }
  }, [txreceipt]);
  useEffect(() => {
    const object = { title, value, address, UNIXtimestamp };
    setObj(object);
  }, [title, value, address, UNIXtimestamp]);

  async function handleSubmit() {
    try {
      showDefaultToast("Uploading...");
      if (!address || !title || !value) return;
      const files = makeFileObjects(obj, address);
      const cid = await storeFiles(files);
      post({ args: [cid] });
      showDefaultToast();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex justify-center">
      <RichEditor
        value={value}
        setValue={setValue}
        title={title}
        setTitle={setTitle}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
