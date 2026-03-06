#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize)]
struct Quote {
    id: String,
    content: String,
    created_at: String,
    updated_at: String,
}

fn data_file_path(handle: &AppHandle) -> Result<PathBuf, String> {
    let base = handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("无法获取应用数据目录: {e}"))?;
    let dir = base.join("linggan");
    if !dir.exists() {
        fs::create_dir_all(&dir).map_err(|e| format!("创建数据目录失败: {e}"))?;
    }
    Ok(dir.join("quotes.json"))
}

#[tauri::command]
fn load_quotes(app: AppHandle) -> Result<Vec<Quote>, String> {
    let path = data_file_path(&app)?;
    if !path.exists() {
        return Ok(Vec::new());
    }
    let content = fs::read_to_string(path).map_err(|e| format!("读取文件失败: {e}"))?;
    let quotes: Vec<Quote> =
        serde_json::from_str(&content).map_err(|e| format!("解析 JSON 失败: {e}"))?;
    Ok(quotes)
}

#[tauri::command]
fn save_quotes(app: AppHandle, quotes: Vec<Quote>) -> Result<(), String> {
    let path = data_file_path(&app)?;
    let json =
        serde_json::to_string_pretty(&quotes).map_err(|e| format!("序列化 JSON 失败: {e}"))?;
    fs::write(path, json).map_err(|e| format!("写入文件失败: {e}"))?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_quotes, save_quotes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

